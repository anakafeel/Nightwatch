"""
Service adapter layer.

API calls *this*.
This file can switch between mock vs real later without changing endpoints.
"""

from __future__ import annotations

from typing import Any, Dict, Tuple, List, Optional

from app.api.schemas import RouteRequest, RouteResult, RouteData
from app.settings import demo_mode
from app.services import routing_engine

# Light-based scoring (works even in mock mode)
from app.services.light_store import count_lights_near_points, safety_score_from_lights


# --- Mock payloads (keep these here so routes.py stays clean) ---
MOCK_SAFEST_GEOJSON = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                # Ottawa-ish (lng, lat)
                "coordinates": [
                    [-75.6972, 45.4215],
                    [-75.6940, 45.4230],
                    [-75.6910, 45.4250],
                    [-75.6880, 45.4275],
                ],
            },
            "properties": {"type": "safest", "name": "Safest Route"},
        }
    ],
}

MOCK_SHORTEST_GEOJSON = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                # Ottawa-ish (lng, lat)
                "coordinates": [
                    [-75.6972, 45.4215],
                    [-75.6925, 45.4245],
                    [-75.6880, 45.4275],
                ],
            },
            "properties": {"type": "shortest", "name": "Shortest Route"},
        }
    ],
}


def _coords_from_fc(fc: dict) -> list[list[float]]:
    """Extract LineString coords [[lng,lat], ...] from a FeatureCollection."""
    try:
        features = fc.get("features") or []
        if not features:
            return []
        geom = (features[0] or {}).get("geometry") or {}
        if geom.get("type") != "LineString":
            return []
        coords = geom.get("coordinates") or []
        return [c for c in coords if isinstance(c, list) and len(c) >= 2]
    except Exception:
        return []


# Keep this realistic + stable (not demo-specific)
WALK_SPEED_MPS = 1.4


def _eta_min_from_distance_m(distance_m: float) -> int:
    """Convert distance (meters) -> ETA (minutes) using walking speed."""
    if distance_m <= 0:
        return 0
    minutes = (distance_m / WALK_SPEED_MPS) / 60.0
    return max(1, int(round(minutes)))


# -----------------------------
# Option B UX: score from density
# -----------------------------
def _clamp(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))


# ✅ IMPORTANT:
# Your real returned densities are ~9..19 lights/100m (from your latest JSON),
# so using 4.0 makes everything clamp to 100.
# Pick a "100 score" density that matches your data scale.
TARGET_LIGHT_DENSITY_PER_100M = 20.0


def _score_from_light_density(light_density: float | None) -> int:
    """
    Map lights/100m -> 0..100 score.

    TARGET_LIGHT_DENSITY_PER_100M maps to 100, higher is clamped.
    Example (target=20):
      20 lights/100m -> 100
      10 lights/100m -> 50
      5 lights/100m  -> 25
    """
    if light_density is None:
        return 0
    try:
        d = float(light_density)
    except Exception:
        return 0
    score = (d / TARGET_LIGHT_DENSITY_PER_100M) * 100.0
    return int(round(_clamp(score, 0.0, 100.0)))


def _nodes_to_featurecollection(G: Any, path: List[Any], route_type: str) -> dict:
    """
    Convert node-id path -> GeoJSON FeatureCollection(LineString)

    Supports node coordinate conventions:
    - OSMnx: node['x']=lng, node['y']=lat
    - Generic: node['lng'], node['lat']
    - Person B: node['pos'] = (lat, lon)
    """
    coords: List[List[float]] = []

    for nid in path:
        try:
            data = G.nodes[nid]
        except Exception:
            continue

        # 1) OSMnx-style / generic
        lat = data.get("y", data.get("lat"))
        lng = data.get("x", data.get("lng"))

        # 2) Person B-style: pos=(lat, lon)
        if (lat is None or lng is None) and "pos" in data:
            try:
                lat, lng = data["pos"]  # (lat, lon)
            except Exception:
                lat, lng = None, None

        if lat is None or lng is None:
            continue

        # GeoJSON wants [lng, lat]
        coords.append([float(lng), float(lat)])

    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {"type": "LineString", "coordinates": coords},
                "properties": {"type": route_type, "name": f"{route_type.title()} Route"},
            }
        ],
    }


def _mock_result() -> RouteResult:
    safest_score_default = 98
    shortest_score_default = 45
    radius_m = 40.0

    safest_coords = _coords_from_fc(MOCK_SAFEST_GEOJSON)
    shortest_coords = _coords_from_fc(MOCK_SHORTEST_GEOJSON)

    safest_lights = 0
    shortest_lights = 0
    safest_score = safest_score_default
    shortest_score = shortest_score_default

    try:
        safest_lights = count_lights_near_points(safest_coords, radius_m=radius_m)
        shortest_lights = count_lights_near_points(shortest_coords, radius_m=radius_m)
        safest_score = safety_score_from_lights(safest_lights)
        shortest_score = safety_score_from_lights(shortest_lights)
    except Exception:
        pass

    safest_reasons = [
        "Mock safest route for demo",
        f"Streetlights near route: {safest_lights} (r={int(radius_m)}m)",
    ]
    shortest_reasons = [
        "Mock shortest route for demo",
        f"Streetlights near route: {shortest_lights} (r={int(radius_m)}m)",
    ]

    if safest_lights or shortest_lights:
        if safest_lights >= shortest_lights:
            safest_reasons.append("Higher light density than the shortest option")
        else:
            shortest_reasons.append("Higher light density than the safest option (unexpected)")

    return RouteResult(
        safest=RouteData(
            geojson=MOCK_SAFEST_GEOJSON,
            distance_m=2400,
            eta_min=_eta_min_from_distance_m(2400),
            safety_score=safest_score,
            coverage="mock+lights",
            reasons=safest_reasons,
        ),
        shortest=RouteData(
            geojson=MOCK_SHORTEST_GEOJSON,
            distance_m=1800,
            eta_min=_eta_min_from_distance_m(1800),
            safety_score=shortest_score,
            coverage="mock+lights",
            reasons=shortest_reasons,
        ),
    )


def compare_routes(req: RouteRequest) -> RouteResult:
    """
    Returns safest + shortest.

    DEMO_MODE=1: returns mock.
    DEMO_MODE=0: calls routing_engine.compare_routes(...)
    """
    if demo_mode():
        return _mock_result()

    start: Tuple[float, float] = (req.start.lat, req.start.lng)
    end: Tuple[float, float] = (req.end.lat, req.end.lng)

    # Pass-through (routing_engine may ignore these; safe either way)
    weights: Optional[Dict[str, float]] = None
    if req.weights is not None:
        weights = {
            "lights": float(req.weights.lights),
            "cameras": float(req.weights.cameras),
        }

    engine_out = routing_engine.compare_routes(
        start=start,
        end=end,
        weights=weights,
        mode=req.mode,
        max_detour=float(req.maxDetour),
        use_cctv=bool(req.useCctv),
    )

    if not engine_out:
        # If routing engine fails, return mock so UI doesn't break
        return _mock_result()

    try:
        shortest = engine_out["shortest"]
        safest = engine_out["safest"]
        comparison: Dict[str, Any] = engine_out.get("comparison", {})

        # graph lives inside routing_engine module (global router)
        G = routing_engine._router.graph  # type: ignore[attr-defined]

        shortest_path = shortest.get("path") or []
        safest_path = safest.get("path") or []

        shortest_fc = _nodes_to_featurecollection(G, shortest_path, "shortest")
        safest_fc = _nodes_to_featurecollection(G, safest_path, "safest")

        # If geometry empty, don't break UI
        if not _coords_from_fc(shortest_fc) or not _coords_from_fc(safest_fc):
            return _mock_result()

        shortest_dist_m = float(shortest.get("distance", 0.0))
        safest_dist_m = float(safest.get("distance", 0.0))

        # Option B: score derived from density (NOT raw avg_safety_score)
        short_density = shortest.get("light_density")
        safe_density = safest.get("light_density")

        shortest_score = _score_from_light_density(short_density)
        safest_score = _score_from_light_density(safe_density)

        detour_pct = comparison.get("distance_increase_percentage")
        safety_gain = comparison.get("safety_improvement")
        same_route = comparison.get("same_route")

        # Keep model avg score as a debug-only line (optional)
        shortest_avg = shortest.get("avg_safety_score", None)
        safest_avg = safest.get("avg_safety_score", None)

        return RouteResult(
            safest=RouteData(
                geojson=safest_fc,
                distance_m=int(round(safest_dist_m)),
                eta_min=_eta_min_from_distance_m(safest_dist_m),
                safety_score=int(safest_score),
                coverage="graph+routing_engine",
                reasons=[
                    f"Lighting: {safe_density if safe_density is not None else '—'} lights / 100m",
                    f"Detour vs shortest: {detour_pct if detour_pct is not None else '—'}%",
                    f"Safety improvement: {safety_gain if safety_gain is not None else '—'}",
                    f"Same route: {same_route if same_route is not None else '—'}",
                    f"Model avg score (debug): {safest_avg if safest_avg is not None else '—'}",
                ],
            ),
            shortest=RouteData(
                geojson=shortest_fc,
                distance_m=int(round(shortest_dist_m)),
                eta_min=_eta_min_from_distance_m(shortest_dist_m),
                safety_score=int(shortest_score),
                coverage="graph+routing_engine",
                reasons=[
                    f"Lighting: {short_density if short_density is not None else '—'} lights / 100m",
                    f"Model avg score (debug): {shortest_avg if shortest_avg is not None else '—'}",
                ],
            ),
        )

    except Exception:
        return _mock_result()
