from __future__ import annotations

from typing import Tuple, Dict, Any, Optional, List
import math

import networkx as nx

from .geo import create_mock_graph
from .safety_model import SafetyModel as SafetyScorer

# Used for "lights per 100m" metric
MIN_DENSITY_LENGTH_M = 100.0


# ============================================================================
# CALCULATING DISTANCE PLUS NEAREST NODES
# ============================================================================

def _haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Haversine distance in meters between two lat/lon points."""
    R = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def _nearest_node(G: nx.Graph, point: Tuple[float, float]) -> Optional[Any]:
    """
    point = (lat, lng)

    Supports node coordinate conventions:
    - Person B: node['pos'] = (lat, lon)
    - OSMnx:   node['y']=lat, node['x']=lng
    - Generic: node['lat'], node['lng'] or node['lon']
    """
    lat, lng = point

    best_n: Optional[Any] = None
    best_d = float("inf")

    for nid, data in G.nodes(data=True):
        nlat = None
        nlng = None

        # 1) Person B: pos=(lat, lon)
        if "pos" in data:
            try:
                nlat, nlng = data["pos"]
            except Exception:
                nlat, nlng = None, None

        # 2) OSMnx style
        if nlat is None:
            nlat = data.get("y", data.get("lat"))
        if nlng is None:
            nlng = data.get("x", data.get("lng"))

        # 3) Sometimes lon is stored as 'lon' ( FAILSAFE)
        if nlng is None:
            nlng = data.get("lon")

        if nlat is None or nlng is None:
            continue

        d = _haversine_m(float(lat), float(lng), float(nlat), float(nlng))
        if d < best_d:
            best_d = d
            best_n = nid

    return best_n


def _get_edge_attrs(G: nx.Graph, u: Any, v: Any) -> Dict[str, Any]:
    edge_data = G.get_edge_data(u, v)
    if edge_data is None:
        return {}
    #(AI GENERATED)
    # MultiGraph/MultiDiGraph: pick the shortest edge by length
    if isinstance(edge_data, dict) and edge_data and all(isinstance(val, dict) for val in edge_data.values()):
        best = None
        best_len = float("inf")
        for attrs in edge_data.values():
            try:
                L = float(attrs.get("length", float("inf")))
            except Exception:
                L = float("inf")
            if L < best_len:
                best_len = L
                best = attrs
        return best or list(edge_data.values())[0]

    # Simple Graph
    if isinstance(edge_data, dict):
        return edge_data

    return {}



# ============================================================================
# CORE ENGINE
# ============================================================================

class RoutingEngine:
    """
    Low-level routing engine using graph algorithms.
    Uses Dijkstra with different weights (length vs safety_cost).
    """

    def __init__(self, graph: nx.Graph):
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
        """Shortest path by distance (edge weight 'length')."""
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
        """Safest path by safety-adjusted cost (edge weight 'safety_cost')."""
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
        """Compute distance, lights, average safety score, and per-segment info."""
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
    *ROUTER.PY WILL CALL THIS CLASS*
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
        """Compare shortest vs safest routes."""
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
# API ADAPTER FUNCTIONS (ROUTER.PY CALLS THESE)
# ============================================================================

_router: Optional[SafeRouter] = None


def init_router(graph: Optional[nx.Graph] = None, alpha: float = 1.0) -> None:
    """
    Initialize global router instance.
    If graph is None, build a graph using geo.py (streetlights CSV).
    """
    global _router

    if graph is None:
        # Person B's geo.py overrides num_nodes to len(csv) anyway; keep safe defaults.
        graph = create_mock_graph(seed=42)

    _router = SafeRouter(graph, alpha=alpha)
    print(f"Routing engine initialized with {graph.number_of_nodes()} nodes, alpha={alpha}")


#(PARTLY AI GENERATED)
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

    NOTE:
    - weights/mode/max_detour/use_cctv are accepted for forward compatibility.
    - For now we only use weights["lights"] to control alpha.
    """
    global _router

    if _router is None:
        init_router()

    weights = weights or {}
    lights_w = float(weights.get("lights", 1.0))


    if _router is None or getattr(_router.scorer, "alpha", 1.0) != lights_w:
        # reuse same graph; just re-score edges with new alpha
        init_router(graph=_router.graph if _router else None, alpha=lights_w)

    if _router is None:
        return None

    # lat/lng to -> nearest node in graph
    start_node = _nearest_node(_router.graph, start)
    end_node = _nearest_node(_router.graph, end)

    if start_node is None or end_node is None:
        print("<!> Could not snap start/end to graph nodes.")
        return None

    return _router.compare_paths(start_node, end_node)
