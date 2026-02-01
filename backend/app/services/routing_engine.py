from __future__ import annotations

from typing import Tuple, Dict, Any, Optional, List

import networkx as nx

from .geo import create_mock_graph, get_random_nodes, print_graph_stats
from .safety_model import SafetyModel 

# Used for "lights per 100m" metric
MIN_DENSITY_LENGTH_M = 100.0

import math

def _haversine_m(lat1, lon1, lat2, lon2) -> float:
    R = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2 * R * math.asin(math.sqrt(a))

def _nearest_node(G: nx.Graph, point: Tuple[float, float]) -> Optional[Any]:
    """
    point = (lat, lng)
    Works with OSMnx-style node attrs: node['y']=lat, node['x']=lng
    Falls back safely if attributes missing.
    """
    lat, lng = point

    best = None
    best_d = float("inf")

    for nid, data in G.nodes(data=True):
        # OSMnx convention
        nlat = data.get("y")
        nlng = data.get("x")

        # some graphs store lat/lng directly
        if nlat is None: nlat = data.get("lat")
        if nlng is None: nlng = data.get("lng")

        if nlat is None or nlng is None:
            continue

        d = _haversine_m(lat, lng, float(nlat), float(nlng))
        if d < best_d:
            best_d = d
            best = nid

    return best

def _get_edge_attrs(G: nx.Graph, u: Any, v: Any) -> Dict[str, Any]:
    """
    Return a flat attribute dict for edge (u, v), supporting Graph and MultiGraph/MultiDiGraph.

    - For Graph: returns dict of attributes
    - For MultiGraph: returns attributes for the first edge key found
    """
    edge_data = G.get_edge_data(u, v)
    if edge_data is None:
        return {}

    # MultiGraph/MultiDiGraph case: edge_data is dict keyed by edge key -> attr dict
    # Example: {0: {'length': 12.3, ...}, 1: {...}}
    if isinstance(edge_data, dict) and edge_data and all(isinstance(val, dict) for val in edge_data.values()):
        # pick the first edge's attrs (hackathon-safe). Later you can pick min length, etc.
        return list(edge_data.values())[0]

    # Simple Graph: already an attribute dict
    if isinstance(edge_data, dict):
        return edge_data

    return {}


class RoutingEngine:
    """
    Low-level routing engine using graph algorithms.

    This class handles the actual pathfinding using Dijkstra's algorithm
    with different edge weight strategies (distance vs. safety).
    """

    def __init__(self, graph: nx.Graph):
        """
        Initialize routing engine with a road network graph.
        
        args:
            graph: networkx graph with edge weights inherited from SafetyModel class
        """
        self.graph = graph

        # Verify graph has necessary attributes (non-fatal warnings)
        if self.graph.number_of_edges() > 0:
            u, v = next(iter(self.graph.edges()))
            attrs = _get_edge_attrs(self.graph, u, v)

            required_attributes = ["length", "lights"]
            for attribute in required_attributes:
                if attribute not in attrs:
                    print(f"<!> WARNING: Graph edges missing '{attribute}' attribute")

    def find_shortest_path(self, start: Any, end: Any) -> Optional[List[Any]]:
        """
        Find shortest path by DISTANCE (traditional routing).
        Uses Dijkstra's algorithm minimizing total distance.

        Args:
            start: starting node ID
            end: ending node ID

        Returns:
            list of node IDs, or None if no path exists
        """
        try:
            return nx.dijkstra_path(self.graph, source=start, target=end, weight="length")
        except nx.NetworkXNoPath:
            print(f"No path exists between {start} and {end}")
            return None
        except nx.NodeNotFound as e:
            print(f"Node not found in graph: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error computing shortest path: {e}")
            return None

    def find_safest_path(self, start: Any, end: Any) -> Optional[List[Any]]:
        """
        Find safest path by SAFETY-ADJUSTED COST.
        Uses Dijkstra's algorithm minimizing safety cost.

        Args:
            start: starting node ID
            end: ending node ID

        Returns:
            list of node IDs, or None if no path exists
        """
        try:
            if self.graph.number_of_edges() == 0:
                raise ValueError("Graph has no edges.")

            u, v = next(iter(self.graph.edges()))
            attrs = _get_edge_attrs(self.graph, u, v)
            if "safety_cost" not in attrs:
                raise ValueError(
                    "Graph edges missing 'safety_cost'. "
                    "Run SafetyScorer.add_safety_scores_to_graph() first."
                )

            return nx.dijkstra_path(self.graph, source=start, target=end, weight="safety_cost")

        except nx.NetworkXNoPath:
            print(f"No path exists between {start} and {end}")
            return None
        except nx.NodeNotFound as e:
            print(f"Node not found in graph: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error computing safest path: {e}")
            return None

    def calculate_path_metrics(self, path: Optional[List[Any]]) -> Optional[Dict[str, Any]]:
        """
        Calculate detailed metrics for a given path.

        Sums:
        - total distance
        - total lights
        - average safety score
        - number of segments

        Args:
            path: list of node IDs representing the route

        Returns:
            dict of metrics or None if invalid
        """
        if not path or len(path) < 2:
            return None

        total_distance = 0.0
        total_lights = 0
        total_safety_score = 0.0
        segments: List[Dict[str, Any]] = []

        for i in range(len(path) - 1):
            u = path[i]
            v = path[i + 1]

            attrs = _get_edge_attrs(self.graph, u, v)
            if not attrs:
                print(f"<!> WARNING: edge {u}→{v} not found in graph")
                continue

            length = float(attrs.get("length", 0.0))
            lights = int(attrs.get("lights", 0))
            safety_score = float(attrs.get("safety_score", 0.0))

            total_distance += length
            total_lights += lights
            total_safety_score += safety_score

            segments.append(
                {
                    "from": u,
                    "to": v,
                    "length": length,
                    "lights": lights,
                    "safety_score": safety_score,
                }
            )

        num_segments = len(segments)
        avg_safety_score = (total_safety_score / num_segments) if num_segments > 0 else 0.0
        light_density = (
            (total_lights / total_distance) * MIN_DENSITY_LENGTH_M if total_distance > 0 else 0.0
        )

        return {
            "path": path,
            "num_segments": num_segments,
            "distance": round(total_distance, 1),
            "lights": total_lights,
            "avg_safety_score": round(avg_safety_score, 2),
            "light_density": round(light_density, 2),
            "segments": segments,
        }


class SafeRouter:
    """
    High-level router that combines safety scoring with pathfinding.
    router.py will call this.
    """

    def __init__(self, graph: nx.Graph, alpha: float = 1.0):
        self.graph = graph
        self.scorer = SafetyScorer(alpha=alpha)
        self.scorer.add_safety_scores_to_graph(self.graph)
        self.engine = RoutingEngine(self.graph)

    def get_safest_route(self, start: Any, end: Any) -> Optional[Dict[str, Any]]:
        path = self.engine.find_safest_path(start, end)
        if not path:
            return None
        metrics = self.engine.calculate_path_metrics(path)
        if metrics:
            metrics["type"] = "safest"
        return metrics

    def get_shortest_route(self, start: Any, end: Any) -> Optional[Dict[str, Any]]:
        path = self.engine.find_shortest_path(start, end)
        if not path:
            return None
        metrics = self.engine.calculate_path_metrics(path)
        if metrics:
            metrics["type"] = "shortest"
        return metrics

    def compare_paths(self, start: Any, end: Any) -> Optional[Dict[str, Any]]:
        """
        Compare shortest vs safest routes.
        """
        shortest_metrics = self.get_shortest_route(start, end)
        safest_metrics = self.get_safest_route(start, end)

        if not shortest_metrics or not safest_metrics:
            return None

        distance_diff = safest_metrics["distance"] - shortest_metrics["distance"]
        lights_diff = safest_metrics["lights"] - shortest_metrics["lights"]
        safety_diff = safest_metrics["avg_safety_score"] - shortest_metrics["avg_safety_score"]

        distance_increase_percentage = (
            (distance_diff / shortest_metrics["distance"]) * 100
            if shortest_metrics["distance"] > 0
            else 0.0
        )

        return {
            "shortest": shortest_metrics,
            "safest": safest_metrics,
            "comparison": {
                "distance_difference": round(distance_diff, 1),
                "distance_increase_percentage": round(distance_increase_percentage, 1),
                "lights_difference": lights_diff,
                "safety_improvement": round(safety_diff, 2),
                "same_route": shortest_metrics["path"] == safest_metrics["path"],
            },
        }


# ============================================================================
# API ADAPTER FUNCTIONS (what router.py will call)
# ============================================================================

_router: Optional[SafeRouter] = None


def init_router(graph: Optional[nx.Graph] = None, alpha: float = 1.0) -> None:
    """
    Initialize the global router instance.

    Args:
        graph: networkx graph (if None, creates mock graph)
        alpha: weight for streetlights
    """
    global _router

    if graph is None:
        graph = create_mock_graph(num_nodes=100, seed=42)

    _router = SafeRouter(graph, alpha=alpha)
    print(f"Routing engine initialized with {graph.number_of_nodes()} nodes")


def compare_routes(
    start: Tuple[float, float],
    end: Tuple[float, float],
    weights: Optional[Dict[str, float]] = None,
    mode: str = "night",
    max_detour: float = 15.0,
    use_cctv: bool = False,
) -> Optional[Dict[str, Any]]:
    """
    Compare safest vs shortest routes.

    Returns:
      {
        "shortest": { ...metrics..., "path": [node ids...] },
        "safest":   { ...metrics..., "path": [node ids...] },
        "comparison": {...}
      }
    """
    global _router

    if _router is None:
        init_router()

    # weights handling (hackathon-safe)
    weights = weights or {}
    lights_w = float(weights.get("lights", 1.0))

    # If you want the lights weight to affect scoring, re-init with alpha=lights_w
    # (Assumes SafetyScorer(alpha) uses alpha as "lights importance")
    init_router(graph=_router.graph, alpha=lights_w)

    # Convert lat/lng -> nearest node
    start_node = _nearest_node(_router.graph, start)
    end_node = _nearest_node(_router.graph, end)

    if start_node is None or end_node is None:
        return None

    return _router.compare_paths(start_node, end_node)

    return comparison
