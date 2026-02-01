import networkx as nx # for creating graphs and working with djikstra's algorithm
import random # for generating random numbers
import pandas as pd
import numpy as np
from math import radians
from scipy.spatial import KDTree

# Set a fixed seed for reproducibility
#seed = random.randint(0, 10000)
seed = 42

# 50 nodes by default, unless specified otherwise
def create_mock_graph(num_nodes=50, seed=seed):
    """Creates a random graph with specified number of nodes and edges."""
    random.seed(seed)
    newGraph = nx.Graph() # create a new empty graph
    
    df = pd.read_csv("../../scripts/ottawa_street_lights.csv")
    num_nodes = len(df) # limit to available streetlights
    latitude = df['lat'].values[:num_nodes]
    longitude = df['lon'].values[:num_nodes]
    
    # Convert lat/lon → flat XY coordinates (meters) for KDTree
    def latlon_to_xy(lat, lon, lat0):
        R = 6371000  # Earth radius in meters
        x = R * np.radians(lon) * np.cos(np.radians(lat0))
        y = R * np.radians(lat)
        return x, y
    
    lat0 = df["lat"].iloc[:num_nodes].mean()  # Reference latitude
    coords = np.array([latlon_to_xy(row.lat, row.lon, lat0) 
                      for _, row in df.head(num_nodes).iterrows()])
    
    # Create nodes with real coordinates
    for i in range(num_nodes):
        newGraph.add_node(i, pos=(df.iloc[i]['lat'], df.iloc[i]['lon']))
    
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