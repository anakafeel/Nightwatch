"""
Service adapter layer.

API calls *this*.
This file can switch between mock vs real later without changing endpoints.
"""

from __future__ import annotations

from typing import Any, Dict, Tuple, List

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


def _eta_min_from_distance_m(distance_m: float, speed_mps: float = 1.4) -> int:
    """Walking ETA default: ~1.4 m/s."""
    if distance_m <= 0:
        return 0
    minutes = (distance_m / speed_mps) / 60.0
    return max(1, int(round(minutes)))


def _score_to_0_100(avg_safety_score: float | None) -> int:
    """
    Convert avg_safety_score to 0..100.

    - If it's in 0..1 -> multiply by 100
    - If it's already ~0..100 -> clamp
    """
    if avg_safety_score is None:
        return 0
    try:
        x = float(avg_safety_score)
    except Exception:
        return 0

    if x > 1.5:  # heuristic: already 0..100
        return int(round(max(0.0, min(100.0, x))))
    return int(round(max(0.0, min(1.0, x)) * 100.0))


def _nodes_to_featurecollection(G: Any, path: List[Any], route_type: str) -> dict:
    """
    Convert node-id path -> GeoJSON FeatureCollection(LineString)
    Uses node attrs x=lng,y=lat (OSMnx) OR lng/lat.
    """
    coords: List[List[float]] = []
    for nid in path:
        data = G.nodes[nid]
        lat = data.get("y", data.get("lat"))
        lng = data.get("x", data.get("lng"))
        if lat is None or lng is None:
            continue
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
            eta_min=12,
            safety_score=safest_score,
            coverage="mock+lights",
            reasons=safest_reasons,
        ),
        shortest=RouteData(
            geojson=MOCK_SHORTEST_GEOJSON,
            distance_m=1800,
            eta_min=9,
            safety_score=shortest_score,
            coverage="mock+lights",
            reasons=shortest_reasons,
        ),
    )


def compare_routes(req: RouteRequest) -> RouteResult:
    """
    Returns safest + shortest.

    DEMO_MODE=1: returns mock.
    DEMO_MODE=0: calls routing_engine.compare_routes(start, end).
    """
    if demo_mode():
        return _mock_result()

    start: Tuple[float, float] = (req.start.lat, req.start.lng)
    end: Tuple[float, float] = (req.end.lat, req.end.lng)

    engine_out = routing_engine.compare_routes(start=start, end=end)
    if not engine_out:
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

        shortest_score = _score_to_0_100(shortest.get("avg_safety_score"))
        safest_score = _score_to_0_100(safest.get("avg_safety_score"))

        short_lights = int(shortest.get("lights", 0))
        safe_lights = int(safest.get("lights", 0))

        short_density = shortest.get("light_density")
        safe_density = safest.get("light_density")

        detour_pct = comparison.get("distance_increase_percentage")
        safety_gain = comparison.get("safety_improvement")
        same_route = comparison.get("same_route")

        return RouteResult(
            safest=RouteData(
                geojson=safest_fc,
                distance_m=int(round(safest_dist_m)),
                eta_min=_eta_min_from_distance_m(safest_dist_m),
                safety_score=int(safest_score),
                coverage="graph+routing_engine",
                reasons=[
                    f"Avg safety score: {safest.get('avg_safety_score', '—')}",
                    f"Lights per 100m: {safe_density if safe_density is not None else '—'}",
                    f"Total lights: {safe_lights}",
                    f"Detour vs shortest: {detour_pct if detour_pct is not None else '—'}%",
                    f"Safety improvement: {safety_gain if safety_gain is not None else '—'}",
                    f"Same route: {same_route if same_route is not None else '—'}",
                ],
            ),
            shortest=RouteData(
                geojson=shortest_fc,
                distance_m=int(round(shortest_dist_m)),
                eta_min=_eta_min_from_distance_m(shortest_dist_m),
                safety_score=int(shortest_score),
                coverage="graph+routing_engine",
                reasons=[
                    f"Avg safety score: {shortest.get('avg_safety_score', '—')}",
                    f"Lights per 100m: {short_density if short_density is not None else '—'}",
                    f"Total lights: {short_lights}",
                ],
            ),
        )

    except Exception:
        return _mock_result()
