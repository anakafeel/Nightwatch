from geo import create_mock_graph, get_random_nodes, print_graph_stats
from safety_model import *
import networkx as nx    


class RoutingEngine:
    """
    Low-level routing engine using graph algorithms.
    
    This class handles the actual pathfinding using Dijkstra's algorithm
    with different edge weight strategies (distance vs. safety).
    """
    
    def __init__(self, graph):
        """
        Initialize routing engine with a road network graph.
        
        args:
            graph: networkx graph with edge weights inherited from safetyscorer class
        """
        self.graph = graph
        
        # verify graph has necessary attributes
        if self.graph.number_of_edges() > 0:
            sample_edge = list(self.graph.edges(data=True))[0]
            required_attributes = ['length', 'lights']
            
            for attribute in required_attributes:
                if attribute not in sample_edge[2]:
                    print(f"<!> WARNING: Graph edges missing '{attribute}' attribute")
    
    def find_shortest_path(self, start, end):
        """
        find shortest path by DISTANCE (traditional routing).
        
        uses dijkstras algorithm minimizing total distance.
        
        args:
            start: starting node ID
            end: ending node ID
        
        returns:
            list: 'path' as sequence of node IDs, or None if no path exists
        """
        try:
            path = nx.dijkstra_path(
                self.graph,
                source = start,
                target = end,
                weight = 'length') # minimize distance only
            return path
        
        except nx.NetworkXNoPath:
            print(f"No path exists between {start} and {end}")
            return None
        
        except nx.NodeNotFound as e:
            print(f"Node not found in graph: {e}")
            return None
    
    def find_safest_path(self, start, end):
        """
        find safest path by SAFETY-ADJUSTED COST.
        
        uses dijkstras algorithm minimizing safety cost and balancing distance and lighting.
        
        args:
            start: starting node ID
            end: ending node ID
        
        returns:
            list: 'path' as sequence of node IDs, or None if no path exists
        """
        try:
            # check if safety_cost attribute exists
            sample_edge = list(self.graph.edges(data=True))[0]
            if 'safety_cost' not in sample_edge[2]:
                raise ValueError(
                    "<!> WARNING:"
                    "- Graph edges missing 'safety_cost' attribute. "
                    "- Run SafetyScorer.add_safety_scores_to_graph() first."
                )
            
            path = nx.dijkstra_path(
                self.graph,
                source = start,
                target = end,
                weight = 'safety_cost'  # minimize safety-adjusted cost
            )
            return path
        
        except nx.NetworkXNoPath:
            print(f"No path exists between {start} and {end}")
            return None
        
        except nx.NodeNotFound as e:
            print(f"Node not found in graph: {e}")
            return None
    
    def calculate_path_metrics(self, path):
        """
        calculate detailed metrics for a given path.
        
        walks through the path and sums up all relevant metrics:
        - total distance
        - total lights
        - average safety score
        - number of segments
        
        args:
            path: list of node IDs representing the route
        
        returns:
            dict: detailed metrics about the path, or None if path is invalid
        """
        if not path or len(path) < 2:
            return None
        
        total_distance = 0.0
        total_lights = 0
        total_safety_score = 0.0
        segments = []
        
        # walk through each edge in the path
        for i in range(len(path) - 1):
            current_node = path[i]
            next_node = path[i + 1]
            
            # get edge data
            try:
                edge_data = self.graph[current_node][next_node]
            except KeyError:
                print(f"<!> WARNING: edge {current_node}→{next_node} not found in graph")
                continue
            
            # extract attributes
            length = edge_data.get('length', 0)
            lights = edge_data.get('lights', 0)
            safety_score = edge_data.get('safety_score', 0)
            
            # accumulate totals
            total_distance += length
            total_lights += lights
            total_safety_score += safety_score
            
            # store segment details for visualization
            segments.append({
                'from': current_node,
                'to': next_node,
                'length': length,
                'lights': lights,
                'safety_score': safety_score
            })
        
        # calculate averages and derived metrics
        num_segments = len(segments)
        
        if num_segments > 0:
            avg_safety_score = total_safety_score / num_segments
        else:
            avg_safety_score = 0
        
        # calculate overall route safety (lights per 100m)
        if total_distance > 0:
            light_density = total_lights / total_distance * min_density_length
        else:
            light_density = 0
        
        return {
            'path': path,
            'num_segments': num_segments,
            'distance': round(total_distance, 1), # round to one decimal place
            'lights': total_lights,
            'avg_safety_score': round(avg_safety_score, 2), # round to two decimal places
            'light_density': round(light_density, 2), # round to two decimal places
            'segments': segments
        }
    
    def compare_paths(self, shortest_path, safest_path):
        """
        compare two paths side-by-side to show the tradeoff between shortest and safest routes.
        
        args:
            shortest_path: path from find_shortest_path()
            safest_path: path from find_safest_path()
        
        returns:
            dict: comparison metrics
        """
        if not shortest_path or not safest_path:
            return None
        
        shortest_metrics = self.calculate_path_metrics(shortest_path)
        safest_metrics = self.calculate_path_metrics(safest_path)
        
        distance_diff = safest_metrics['distance'] - shortest_metrics['distance']
        lights_diff = safest_metrics['lights'] - shortest_metrics['lights']
        safety_diff = safest_metrics['avg_safety_score'] - shortest_metrics['avg_safety_score']
        
        if shortest_metrics['distance'] > 0:
            distance_increase_percentage = (distance_diff / shortest_metrics['distance']) * 100
        else:
            distance_increase_percentage = 0
        
        return {
            'shortest': shortest_metrics,
            'safest': safest_metrics,
            'distance_difference': round(distance_diff, 1), # round to one decimal place
            'distance_increase_percentage': round(distance_increase_percentage, 1), # round to one decimal place
            'lights_difference': lights_diff,
            'safety_improvement': round(safety_diff, 2), # round to two decimal places
            'same_route': shortest_path == safest_path
        }
    
    def get_path_description(self, path):
        """
        generate a human-readable description of a path.
        
        args:
            path: list of node IDs
        
        returns:
            str: description of the route
        """
        if not path:
            return "no path"
        
        metrics = self.calculate_path_metrics(path)
        if not metrics:
            return "invalid path"
        
        path_str = ' → '.join(str(node) for node in path)
        
        return (
            f"Route: {path_str}\n"
            f"  Segments: {metrics['num_segments']}\n"
            f"  Distance: {metrics['distance']}m\n"
            f"  Lights: {metrics['lights']}\n"
            f"  Avg safety: {metrics['avg_safety_score']}\n"
            f"  Density: {metrics['light_density']:.2f} lights/100m"
        )


# ============================================================================
# TESTING CODE
# ============================================================================

if __name__ == "__main__":
    print("=" * 70)
    print("STEP 3: Routing Engine Test")
    print("=" * 70)

    
    # Test 1: Create graph and add safety scores
    print("\n--- Test 1: Setup ---")
    
    G = create_mock_graph(num_nodes=40, seed=42)
    print("\nGraph created:")
    print_graph_stats(G)
    
    print("\nAdding safety scores...")
    scorer = SafetyScorer(alpha=1.0)
    scorer.add_safety_scores_to_graph(G)
    
    # Test 2: Find shortest path
    print("\n\n--- Test 2: Shortest Path (Distance-Based) ---")
    
    engine = RoutingEngine(G)
    
    start, end = 0, 30
    print(f"\nFinding shortest route from {start} to {end}...")
    
    shortest_path = engine.find_shortest_path(start, end)
    
    if shortest_path:
        print(f"\nShortest path found: {shortest_path}")
        print(engine.get_path_description(shortest_path))
    else:
        print("No path found!")
    
    # Test 3: Find safest path
    print("\n\n--- Test 3: Safest Path (Safety-Based) ---")
    
    print(f"\nFinding safest route from {start} to {end}...")
    
    safest_path = engine.find_safest_path(start, end)
    
    if safest_path:
        print(f"\nSafest path found: {safest_path}")
        print(engine.get_path_description(safest_path))
    else:
        print("No path found!")
    
    # Test 4: Compare routes
    print("\n\n--- Test 4: Route Comparison ---")
    
    if shortest_path and safest_path:
        comparison = engine.compare_paths(shortest_path, safest_path)
        
        print("\n" + "=" * 70)
        print("SHORTEST ROUTE (minimize distance):")
        print("=" * 70)
        print(f"Distance: {comparison['shortest']['distance']}m")
        print(f"Lights: {comparison['shortest']['lights']}")
        print(f"Safety score: {comparison['shortest']['avg_safety_score']}")
        print(f"Path: {' → '.join(map(str, shortest_path))}")
        
        print("\n" + "=" * 70)
        print("SAFEST ROUTE (maximize safety):")
        print("=" * 70)
        print(f"Distance: {comparison['safest']['distance']}m")
        print(f"Lights: {comparison['safest']['lights']}")
        print(f"Safety score: {comparison['safest']['avg_safety_score']}")
        print(f"Path: {' → '.join(map(str, safest_path))}")
        
        print("\n" + "=" * 70)
        print("COMPARISON:")
        print("=" * 70)
        
        if comparison['same_route']:
            print("✓ Both routes are identical!")
            print("  (The shortest route is already the safest)")
        else:
            print(f"Distance increase: +{comparison['distance_difference']}m ({comparison['distance_increase_percentage']}%)")
            print(f"Additional lights: +{comparison['lights_difference']}")
            print(f"Safety improvement: +{comparison['safety_improvement']}")
            
            # Determine if tradeoff is worth it
            if comparison['distance_increase_percentage'] < 20 and comparison['safety_improvement'] > 0.5:
                print("\n💡 Recommendation: SAFEST route (minimal extra distance, significant safety gain)")
            elif comparison['distance_increase_percentage'] > 50:
                print("\n💡 Recommendation: SHORTEST route (safest route is too long)")
            else:
                print("\n💡 Recommendation: User preference (balanced tradeoff)")
    
    # Test 5: Multiple random routes
    print("\n\n--- Test 5: Multiple Random Routes ---")
    
    print("\nTesting 5 random start/end pairs...")
    print(f"\n{'Start':<8} {'End':<8} {'Shortest(m)':<15} {'Safest(m)':<15} {'Diff(%)':<10} Same?")
    print("-" * 70)
    
    for i in range(5):
        nodes = get_random_nodes(G, count=2)
        s, e = nodes[0], nodes[1]
        
        short = engine.find_shortest_path(s, e)
        safe = engine.find_safest_path(s, e)
        
        if short and safe:
            short_m = engine.calculate_path_metrics(short)
            safe_m = engine.calculate_path_metrics(safe)
            
            diff_percentage = ((safe_m['distance'] - short_m['distance']) / short_m['distance']) * 100 if short_m['distance'] > 0 else 0    
            same = "Yes ✓" if short == safe else "No"
            
            print(f"{s:<8} {e:<8} {short_m['distance']:<15.1f} {safe_m['distance']:<15.1f} {diff_percentage:<10.1f} {same}")
    
    # Test 6: Edge cases
    print("\n\n--- Test 6: Edge Cases ---")
    
    print("\nTest 6a: Route from node to itself")
    same_node_path = engine.find_shortest_path(5, 5)
    if same_node_path:
        print(f"Path: {same_node_path}")
    else:
        print("No path needed (already at destination)")
    
    print("\nTest 6b: Non-existent node")
    invalid_path = engine.find_shortest_path(0, 9999)
    print(f"Result: {invalid_path}")
    
    print("\nTest 6c: Path with only 2 nodes (direct connection)")
    # Find two directly connected nodes
    edge = list(G.edges())[0]
    direct_path = engine.find_shortest_path(edge[0], edge[1])
    if direct_path:
        print(f"Direct path: {direct_path}")
        metrics = engine.calculate_path_metrics(direct_path)
        print(f"Distance: {metrics['distance']}m, Lights: {metrics['lights']}")
    
    print("\n" + "=" * 70)
    print("All tests completed!")
    print("=" * 70)