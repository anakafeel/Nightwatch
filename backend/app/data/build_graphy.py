from binarytree import tree, Node
import math
import pandas as pd
import folium
import numpy as np
from scipy.spatial import KDTree
import networkx as nx

# AI GENERATED CODE TO BUILD GRAPH FROM STREET LIGHT DATA

data_file = pd.read_csv('ottawa_street_lights.csv')

Light_ID = data_file['id']
Light_LAT = data_file['lat']
Light_LON = data_file['lon']

avg_latitude = data_file['lat'].mean()
avg_longitude = data_file['lon'].mean()

def convert_lat_lon_x_y(lat, lon, avg_lat, avg_lon):
    R = 6371000  # Radius of the Earth in meters
    converted_x = R * ((math.radians(lon)) - (math.radians(avg_lon))) * math.cos(math.radians(avg_lat))
    converted_y = R * ((math.radians(lat)) - (math.radians(avg_lat)))
    return converted_x, converted_y

coordinates = np.array([convert_lat_lon_x_y(Light_LAT, Light_LON, avg_latitude, avg_longitude) for _, row in data_file.iterrows()])

tree = KDTree(coordinates)

graph = nx.Graph()

for _, row in data_file.iterrows():
    graph.add_node(row['id'], pos=(row['lat'], row['lon']))

K = 5  # number of nearest neighbors per node

distances, indices = tree.query(coordinates, k=K + 1)

for i in range(len(data_file)):
    node_i = data_file.iloc[i]["id"]

    for j_idx, dist in zip(indices[i][1:], distances[i][1:]):
        node_j = data_file.iloc[j_idx]["id"]

        graph.add_edge(node_i, node_j, weight=dist)

print(f"Graph built:")
print(f"  Nodes: {graph.number_of_nodes()}")
print(f"  Edges: {graph.number_of_edges()}")
# class KD_Tree:

#     def __init__(self, data):
#         self.data = data
#         self.tree = None

#     def build(self, points, depth):

#         k = len(points.columns)
#         _axis = depth % k 
#         _column = points.columns[_axis]

#         if len(points) == 0:
#             return None
        
#         objects_list = points.sort_values(by = [_column], ascending = True)

#         if len(objects_list) % 2 == 0:
#             median_idx = int((len(objects_list)/2))
#         else:
#             median_idx = math.floor((len(objects_list)/2))

#         node = Node(round(objects_list.iloc[median_idx][_column]), 3)
#         node.left = seld._build(objects_list.iloc[0:median_idx], depth + 1)
#         node.left = seld._build(objects_list.iloc[median_idx+1:], depth + 1)

#         return node
    
#     def build(self):
#         self.tree = self._build(self.data, depth = 0)

#     info = pd.DataFrame(convert_lat_lon_x_y, columns=["X", "Y"])
    
#     KD = KD_Tree(info)
#     KD.build()


    