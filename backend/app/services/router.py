"""
Service adapter layer.

API calls *this*.
This file can switch between mock vs real later without changing endpoints.
"""

from typing import Any, Dict, Tuple

from app.api.schemas import RouteRequest, RouteResult, RouteData
from app.settings import demo_mode

# Person B engine (real later). Keep import even if unused for now.
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
    """
    Extract LineString coordinates from a FeatureCollection like our mock payloads.
    Returns [[lon, lat], ...]. Falls back to [] if structure differs.
    """
    try:
        features = fc.get("features") or []
        if not features:
            return []
        geom = (features[0] or {}).get("geometry") or {}
        if geom.get("type") != "LineString":
            return []
        coords = geom.get("coordinates") or []
        # ensure it's a list of [lon, lat]
        return [c for c in coords if isinstance(c, list) and len(c) >= 2]
    except Exception:
        return []


def _mock_result() -> RouteResult:
    # Defaults (in case CSV is missing / empty)
    safest_score_default = 98
    shortest_score_default = 45
    radius_m = 40.0

    safest_coords = _coords_from_fc(MOCK_SAFEST_GEOJSON)
    shortest_coords = _coords_from_fc(MOCK_SHORTEST_GEOJSON)

    # Compute lights near each route (works even with mocked geometry)
    safest_lights = 0
    shortest_lights = 0
    safest_score = safest_score_default
    shortest_score = shortest_score_default

    try:
        safest_lights = count_lights_near_points(safest_coords, radius_m=radius_m)
        shortest_lights = count_lights_near_points(shortest_coords, radius_m=radius_m)

        # Convert to 0..100 score
        safest_score = safety_score_from_lights(safest_lights)
        shortest_score = safety_score_from_lights(shortest_lights)
    except Exception:
        # Stay demo-safe: never break the endpoint in a hackathon
        pass

    safest_reasons = [
        "Mock safest route for demo",
        f"Streetlights near route: {safest_lights} (r={int(radius_m)}m)",
    ]
    shortest_reasons = [
        "Mock shortest route for demo",
        f"Streetlights near route: {shortest_lights} (r={int(radius_m)}m)",
    ]

    # Optional extra “story” reason, only if we actually computed something
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

    DEMO_MODE=1 (default): always returns mock.
    DEMO_MODE=0: calls routing_engine.compare_routes(...) (Person B later).
    """
    # Always safe demo behavior unless explicitly disabled
    if demo_mode():
        return _mock_result()

    # Keep signature stable: (lat, lng) tuples
    start: Tuple[float, float] = (req.start.lat, req.start.lng)
    end: Tuple[float, float] = (req.end.lat, req.end.lng)

    weights: Dict[str, Any] = {}
    if req.weights is not None:
        weights = {"lights": req.weights.lights, "cameras": req.weights.cameras}

    # Phase 2 (later): real engine
    return routing_engine.compare_routes(
        start=start,
        end=end,
        weights=weights,
        mode=req.mode,
        max_detour=req.maxDetour,
        use_cctv=req.useCctv,
    )
