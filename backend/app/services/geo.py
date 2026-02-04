from __future__ import annotations

import networkx as nx
import random
import numpy as np
import time
from functools import lru_cache
from pathlib import Path
from scipy.spatial import KDTree
from typing import Tuple

# Path to streetlights CSV
CSV_PATH = Path(__file__).resolve().parents[2] / "scripts" / "ottawa_street_lights.csv"

seed = 42


@lru_cache(maxsize=1)
def _load_streetlight_coords() -> Tuple[np.ndarray, np.ndarray]:
    """
    Load lat/lon from CSV once, cache forever.
    Only loads the 2 columns we need with explicit dtypes.
    """
    import pandas as pd

    start = time.perf_counter()
    df = pd.read_csv(
        CSV_PATH,
        usecols=["lat", "lon"],
        dtype={"lat": "float64", "lon": "float64"},
    )
    elapsed = time.perf_counter() - start
    print(f"[geo] Loaded {len(df)} streetlights in {elapsed:.2f}s (cached)")
    return df["lat"].values, df["lon"].values


def create_mock_graph(num_nodes=50, seed=seed):
    """Creates a graph from cached streetlight coordinates."""
    random.seed(seed)
    newGraph = nx.Graph()

    latitude, longitude = _load_streetlight_coords()
    num_nodes = len(latitude)
    
    # Convert lat/lon → flat XY coordinates (meters) for KDTree
    def latlon_to_xy(lat, lon, lat0):
        R = 6371000  # Earth radius in meters
        x = R * np.radians(lon) * np.cos(np.radians(lat0))
        y = R * np.radians(lat)
        return x, y

    lat0 = float(np.mean(latitude))  # Reference latitude
    coords = np.array([latlon_to_xy(latitude[i], longitude[i], lat0)
                       for i in range(num_nodes)])

    # Create nodes with real coordinates
    for i in range(num_nodes):
        newGraph.add_node(i, pos=(latitude[i], longitude[i]))
    
    # Build KDTree for fast nearest neighbor search
    tree = KDTree(coords)
    
    # Connect each node to its K nearest neighbors (realistic street network)
    K = 4  # Connect to 4 nearest streetlights (like your random.randint(2,4))
    max_distance = 300  # Max walkable distance in meters
    
    distances, indices = tree.query(coords, k=K+1)  # +1 to skip self
    
    for i in range(num_nodes):
        for j_idx, dist in zip(indices[i][1:], distances[i][1:]):  # Skip self (index 0)
            if dist <= max_distance and not newGraph.has_edge(i, j_idx):
                lights = random.randint(0, 5)  # Keep your lights logic
                
                newGraph.add_edge(i, j_idx,
                                length=dist,  # REAL distance in meters!
                                lights=lights)
    
    # Ensure connectivity (your existing code)
    if not nx.is_connected(newGraph):
        islands = list(nx.connected_components(newGraph))
        for i in range(len(islands) - 1):
            node_a = list(islands[i])[0]
            node_b = list(islands[i + 1])[0]
            newGraph.add_edge(node_a, node_b,
                           length=random.uniform(100, 200),
                           lights=random.randint(1, 3))
    
    return newGraph
    
# get two random nodes from the graph as start and end points
def get_random_nodes(graph, count=2):
    nodes = list(graph.nodes())
    return random.sample(nodes, min(count, len(nodes))) # make sure we dont sample from more nodes than they exist
        
def print_graph_stats(graph):
    # overall graph stats
    print(f"Graph Statistics:")
    print(f"Number of nodes: {graph.number_of_nodes()}")
    print(f"Number of edges: {graph.number_of_edges()}")
    print(f"Connected: {nx.is_connected(graph)}")
    
    # safest path/distace between randomly chosen nodes
    if graph.number_of_edges() > 0:
        sample_edge = list(graph.edges(data=True))[0]
        print(f"\nSample Edge: {sample_edge[0]} -> {sample_edge[1]}")
        print(f"    Length: {sample_edge[2]['length']:.1f} meters")
        print(f"    Streetlights: {sample_edge[2]['lights']}")
        
if __name__ == "__main__":
    print("Creating mock road network...\n")
    
    newGraph = create_mock_graph(num_nodes=30)
    print_graph_stats(newGraph)
    
    print("\nRandom test nodes:")
    test_nodes = get_random_nodes(newGraph, count=2)
    print(f"  Start: {test_nodes[0]}")
    print(f"  End: {test_nodes[1]}")