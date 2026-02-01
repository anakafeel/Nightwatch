# backend/app/services/light_store.py
from __future__ import annotations

from functools import lru_cache
from pathlib import Path
import csv
import math
from typing import List, Tuple

# Points are stored in CSV as lat/lon (from your Overpass export)
DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "ottawa_street_lights.csv"


def _haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in meters."""
    R = 6371000.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


@lru_cache(maxsize=1)
def load_lights() -> List[Tuple[float, float]]:
    """
    Load streetlight points from CSV.
    Returns a list of (lat, lon).
    """
    if not DATA_PATH.exists():
        # No data available; backend should still run.
        return []

    pts: List[Tuple[float, float]] = []
    with DATA_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                lat = float(row["lat"])
                lon = float(row["lon"])
                pts.append((lat, lon))
            except Exception:
                continue
    return pts


def count_lights_near_points(points_lonlat: List[List[float]], radius_m: float = 40.0) -> int:
    """
    Count how many streetlights are within radius_m of ANY point on a route polyline.

    points_lonlat: [[lon, lat], ...] (GeoJSON coordinate order)
    """
    lights = load_lights()
    if not lights or not points_lonlat:
        return 0

    count = 0
    for (lat_l, lon_l) in lights:
        for lon, lat in points_lonlat:
            if _haversine_m(lat, lon, lat_l, lon_l) <= radius_m:
                count += 1
                break  # don't double-count the same light
    return count


def safety_score_from_lights(num_lights: int) -> int:
    """
    Demo-friendly mapping: more lights => higher score (0..100).
    Tuned for quick hackathon visuals.
    """
    score = int(min(100, max(0, 20 + num_lights * 2)))
    return score
