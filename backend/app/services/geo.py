import networkx as nx # for creating graphs and working with djikstra's algorithm
import random # for generating random numbers

# Set a fixed seed for reproducibility
#seed = random.randint(0, 10000)
seed = 42

# 50 nodes by default, unless specified otherwise
def create_mock_graph(num_nodes=50, seed=seed):
    """Creates a random graph with specified number of nodes and edges."""
    random.seed(seed)
    newGraph = nx.Graph() # create a new empty graph
    
    # create i nodes with randomly generated lat/long coordinates
    for i in range(num_nodes):
        latitude = random.uniform(0, 1000) # x coordinates
        longitude = random.uniform(0, 1000) # y coordinates
        newGraph.add_node(i, pos=(latitude, longitude)) # add nodes to newGraph
        
    # create edges of random lengths and give them safety scores
    for i in range(num_nodes):
        # connect to 2-4 nearby nodes to create a grid like network
        num_connections = random.randint(2, 4)
        for _ in range(num_connections):
            j = random.randint(0, num_nodes - 1) # pick a random node to connect to
            if i != j and not newGraph.has_edge(i, j): # if it is not the same node/edge
                newGraph.add_edge(i, j, # add edge between nodes i and j 
                            length=random.uniform(50, 300), # 50-300 meters
                            lights = random.randint(0, 5), # 0-5 streetlights
                           )
    
    # if nodes not connected, connect them
    if not nx.is_connected(newGraph):
        islands = list(nx.connected_components(newGraph)) # fetch all disconnected islands in a list format
        for i in range(len(islands) - 1):
            node_a = list(islands[i])[0]
            node_b = list(islands[i + 1])[0]
            newGraph.add_edge(node_a, node_b, # add edge between nodes of two islands
                       length=random.uniform(100, 200),
                       lights=random.randint(1, 3),
                      )
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