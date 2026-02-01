
from .geo import create_mock_graph, print_graph_stats


# minimum length in meters to consider for safety calculations
min_density_length = 100 

class SafetyModel:
    """
    calculates safety scores for road segments based on streetlight density
    
     the safety model considers:
     - density of streetlights (lights per 100 meters)
     - total segment length (longer dark segments are less safe)
    """
    
    def __init__(self, alpha=1.0, beta=2.0):
        """
        initializi ng safety scorer with configurable weights.
        
        args:
            alpha: weight for streetlights which contribute  to safety
            beta: safe density calculated using minimum lights per 100m (default: 2.0)
        """
        self.alpha = alpha
        self.beta = beta
        
        print(f"initializing safety scores...")
        print(f"    α (lights weight) = {alpha}")
        print(f"    β (minimum safe density) = {beta} lights/{min_density_length}m")
    
    def calculate_edge_safety(self, lights, length):
        """
        (AI GENERATED DOCSTRING)
        Calculating safety score for a single road segment.
        
        formula used:
            safety_score = α * (lights / length) * 100
        
        args:
            lights: number of streetlights on this road
            length: length of road in meters
        
        returns:
            float: safety score (higher = safer)
            
        Examples:
            # Dark alley: 100m, 0 lights
            calculate_edge_safety(0, 100) → 0.0
            
            # Poorly lit street: 100m, 1 light
            calculate_edge_safety(1, 100) → 1.0
            (with α=1.0)
            
            # Residential street: 100m, 2 lights
            calculate_edge_safety(2, 100) → 2.0
            
            # Well-lit street: 100m, 4 lights
            calculate_edge_safety(4, 100) → 4.0
            
            # Main road: 200m, 8 lights
            calculate_edge_safety(8, 200) → 4.0
            (same density as previous example)
        """
        # prevent division by zero
        if length <= 0:
            return 0.0
        
        # calculating streetlight density per minimum density length
        light_density = (lights / length) * min_density_length
        
        # applying weight
        safety_score = self.alpha * light_density
        
        return safety_score
    
    def calculate_edge_cost(self, lights, length):
        """
        calculating routing cost based on safety.
        
        formula used:
            cost = length / (1 + safety_score)
        
        args:
            lights: number of streetlights on this road
            length: length of road in meters
        
        returns:
            float: routing cost for this edge (lower = safer)
        """
        safety_score = self.calculate_edge_safety(lights, length)
        
        # transforming safety into cost
        cost = length / (1 + safety_score)
        
        return cost
    
    def classify_edge_safety(self, lights, length):
        """
        Classifyi ng edge into safety categories.
        Useful for visualization and reporting.
        
        Args:
            lights: Number of streetlights
            length: Length in meters
        
        Returns:
            str: Safety classification
                 'unsafe' - No or very few lights
                 'moderate' - Some lighting
                 'safe' - Well-lit
        """
        
        if length > 0:
            light_density = (lights / length) * min_density_length
        else:
            light_density = 0
        
        if light_density < 1.0:
            # light density less than 1 light per 100m
            return 'unsafe'
        elif light_density < self.beta: 
            # light density lower than safe threshold
            return 'moderate'
        else:
            # light density meets or exceeds safe threshold 
            return 'safe'
    
    #(AI GENERATED)
    def add_safety_scores_to_graph(self, graph):
        """
        add safety scores to all edges in the graph by modifying the graph in 
        place and adding new edge attributes.
        
        args:
            graph: networkx graph with 'length' and 'lights' attributes
        
        returns:
            networkx graph with added 'safety_score' (higher = safer) and 
            'safety_cost' (lower = safer) attributes
        """
        edges_processed = 0
        edges_with_issues = 0
        
        for edge_start, edge_end, data in graph.edges(data=True):
            try:
                # extract required attributes
                length = data['length']
                lights = data['lights']
                
                # calculate safety metrics
                safety = self.calculate_edge_safety(lights, length)
                cost = self.calculate_edge_cost(lights, length)
                classification = self.classify_edge_safety(lights, length)
                
                # Add to graph
                graph[edge_start][edge_end]['safety_score'] = safety
                graph[edge_start][edge_end]['safety_cost'] = cost
                graph[edge_start][edge_end]['safety_class'] = classification
                
                edges_processed += 1
                
            except KeyError as e:
                edges_with_issues += 1
                print(f"<!> WARNING: edge {edge_start}→{edge_end} missing attribute: {e}")
                # set default values for missing data
                graph[edge_start][edge_end]['safety_score'] = 0.0
                graph[edge_start][edge_end]['safety_cost'] = data.get('length', 999999)
                graph[edge_start][edge_end]['safety_class'] = 'unsafe'
        
        print(f"\nprocessed {edges_processed} edges")
        if edges_with_issues > 0:
            print(f"<!> WARNING: {edges_with_issues} edges had missing data")
        
        return graph
    
    def analyze_graph_safety(self, graph):
        """
        analyze overall safety distribution in the graph for debugging.
        
        args:
            graph: networkx graph with safety_score attributes
        
        returns:
            dict: statistics about safety in the network
        """
        safety_scores = []
        safety_classes = {'unsafe': 0, 'moderate': 0, 'safe': 0}
        
        for _, _, data in graph.edges(data=True):
            if 'safety_score' in data:
                safety_scores.append(data['safety_score'])
            if 'safety_class' in data:
                safety_classes[data['safety_class']] += 1
        
        if not safety_scores:
            return {"<!> ERROR": "no safety scores found in graph"}
        
        total_edges = len(safety_scores)
        
        return {
            'total_edges': total_edges,
            'min_safety': min(safety_scores),
            'max_safety': max(safety_scores),
            'avg_safety': sum(safety_scores) / len(safety_scores),
            'unsafe_edges': safety_classes['unsafe'],
            'moderate_edges': safety_classes['moderate'],
            'safe_edges': safety_classes['safe'],
            'unsafe_pct': (safety_classes['unsafe'] / total_edges) * 100,
            'moderate_pct': (safety_classes['moderate'] / total_edges) * 100,
            'safe_pct': (safety_classes['safe'] / total_edges) * 100,
        }


# MOCK DATA PLACEHOLDER TEST ( AI GENERATED FOR TESTING PURPOSES ONLY )
if __name__ == "__main__":
    print("=" * 70)
    print("Safety Scoring Model Test (Streetlights Only)")
    print("=" * 70)
    
    # Test 1: Individual edge calculations
    print("\n--- Test 1: Individual Edge Safety Calculations ---")
    
    scorer = SafetyScorer(alpha=1.0)
    
    test_cases = [
        (0, 100, "Dark alley (no lights)"),
        (1, 100, "Poorly lit street"),
        (2, 100, "Residential street"),
        (4, 100, "Well-lit street"),
        (8, 200, "Main road (long, well-lit)"),
        (2, 50, "Short well-lit alley"),
        (1, 300, "Long dark road"),
    ]
    
    print(f"\n{'Lights':<8} {'Length(m)':<12} {'Density':<12} {'Safety':<10} {'Cost':<10} {'Class':<12} Description")
    print("-" * 100)
    
    for lights, length, desc in test_cases:
        density = (lights / length) * 100
        safety = scorer.calculate_edge_safety(lights, length)
        cost = scorer.calculate_edge_cost(lights, length)
        classification = scorer.classify_edge_safety(lights, length)
        print(f"{lights:<8} {length:<12} {density:<12.2f} {safety:<10.2f} {cost:<10.1f} {classification:<12} {desc}")
    
    # Test 2: Graph integration
    print("\n\n--- Test 2: Graph Integration ---")
    
    G = create_mock_graph(num_nodes=30, seed=42)
    print("\nOriginal graph:")
    print_graph_stats(G)
    
    print("\n\nApplying safety scores...")
    scorer.add_safety_scores_to_graph(G)
    
    # Check that safety attributes were added
    print("\n\nSample edges with safety scores:")
    for i, (edge_start, edge_end, data) in enumerate(list(G.edges(data=True))[:5]):
        density = (data['lights'] / data['length']) * 100
        print(f"\nEdge {edge_start}→{edge_end}:")
        print(f"  Length: {data['length']:.1f}m")
        print(f"  Lights: {data['lights']}")
        print(f"  Density: {density:.2f} lights/100m")
        print(f"  Safety score: {data['safety_score']:.2f}")
        print(f"  Safety cost: {data['safety_cost']:.1f}")
        print(f"  Classification: {data['safety_class']}")
    
    # Test 3: Graph-wide safety analysis
    print("\n\n--- Test 3: Network Safety Analysis ---")
    
    stats = scorer.analyze_graph_safety(G)
    print(f"\nNetwork Safety Statistics:")
    print(f"  Total edges: {stats['total_edges']}")
    print(f"  Safety range: {stats['min_safety']:.2f} to {stats['max_safety']:.2f}")
    print(f"  Average safety: {stats['avg_safety']:.2f}")
    print(f"\nSafety Distribution:")
    print(f"  Unsafe edges: {stats['unsafe_edges']} ({stats['unsafe_pct']:.1f}%)")
    print(f"  Moderate edges: {stats['moderate_edges']} ({stats['moderate_pct']:.1f}%)")
    print(f"  Safe edges: {stats['safe_edges']} ({stats['safe_pct']:.1f}%)")
    
    # Test 4: Different alpha values
    print("\n\n--- Test 4: Alpha Weight Comparison ---")
    
    test_edge = (3, 150)  # 3 lights, 150m (2 lights/100m)
    
    alphas = [0.5, 1.0, 1.5, 2.0]
    
    print(f"\nTest edge: {test_edge[0]} lights over {test_edge[1]}m")
    print(f"Density: {(test_edge[0]/test_edge[1])*100:.2f} lights/100m")
    print(f"\n{'Alpha':<10} {'Safety Score':<15} {'Cost':<15} Effect")
    print("-" * 70)
    
    for alpha in alphas:
        s = SafetyScorer(alpha=alpha)
        safety = s.calculate_edge_safety(*test_edge)
        cost = s.calculate_edge_cost(*test_edge)
        
        if alpha == 0.5:
            effect = "Less sensitive to lighting"
        elif alpha == 1.0:
            effect = "Standard (default)"
        elif alpha == 1.5:
            effect = "More sensitive to lighting"
        else:
            effect = "High sensitivity"
        
        print(f"{alpha:<10.1f} {safety:<15.2f} {cost:<15.1f} {effect}")
    
    # Test 5: Comparative scenarios
    print("\n\n--- Test 5: Routing Decision Examples ---")
    
    scorer = SafetyScorer(alpha=1.0)
    
    scenarios = [
        ("Short but dark", 100, 0),
        ("Short and lit", 100, 3),
        ("Long but very well-lit", 300, 12),
        ("Medium length, medium lights", 200, 4),
    ]
    
    print(f"\n{'Scenario':<30} {'Length':<10} {'Lights':<10} {'Cost':<10} Decision")
    print("-" * 80)
    
    for desc, length, lights in scenarios:
        cost = scorer.calculate_edge_cost(lights, length)
        
        if cost < 50:
            decision = "Strongly prefer ✓✓"
        elif cost < 100:
            decision = "Prefer ✓"
        elif cost < 150:
            decision = "Neutral ~"
        else:
            decision = "Avoid ✗"
        
        print(f"{desc:<30} {length:<10} {lights:<10} {cost:<10.1f} {decision}")
    
    print("\n" + "=" * 70)
    print("All tests completed!")
    print("=" * 70)