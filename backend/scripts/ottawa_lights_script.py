import requests
import pandas as pd

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

#OSM query
query = """
[out:json][timeout:120];
node["highway"="street_lamp"](45.2,-76.1,45.6,-75.2);
out body;
"""
#"""
#[out:json] [timeout:60];
#area["name" = "Ottawa, Ontario, Canada"]["boundary" = "administrative"] -> .searchArea;
#(
#    node["highway" = "street_lamp"] (area.searchArea);
#);
#out body;
#"""

response = requests.post(OVERPASS_URL, data=query)
#raise error 
response.raise_for_status()

data = response.json() #return json
print(len(data["elements"]))
print(data["elements"][:3])

streetlights = []

for x in data["elements"]:
    streetlights.append({
        "id": x["id"],
        "lat": x["lat"],
        "lon": x["lon"],
        "tags": x.get("tags", {})
        })
    
#data frame
df = pd.DataFrame(streetlights)
tags_df = pd.json_normalize(df["tags"])
df = df.drop(columns=["tags"]).join(tags_df)

OUT = "ottawa_street_lights.csv"
df.to_csv(OUT, index=False)
print(f"Saved {len(df)} streetlights to {OUT}")



