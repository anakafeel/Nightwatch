"""
Service adapter layer.

API calls *this*.
This file can switch between mock vs real later without changing endpoints.
"""

from typing import Any, Dict, Tuple

from app.api.schemas import RouteRequest, RouteResult, RouteData

# Person B engine (real later). Keep import even if unused for now.
from app.services import routing_engine


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


def compare_routes(req: RouteRequest) -> RouteResult:
    """
    Returns safest + shortest.
    For now: ALWAYS mock.
    Later: call routing_engine.compare_routes(...) and return real.
    """

    # Keep signature stable: (lat, lng) tuples
    start: Tuple[float, float] = (req.start.lat, req.start.lng)
    end: Tuple[float, float] = (req.end.lat, req.end.lng)

    weights: Dict[str, Any] = {}
    if req.weights is not None:
        weights = {"lights": req.weights.lights, "cameras": req.weights.cameras}

    # --- Phase 1 (now): return mock always ---
    _ = (start, end, weights, req.mode, req.maxDetour, req.useCctv)  # silence unused for now

    return RouteResult(
        safest=RouteData(
            geojson=MOCK_SAFEST_GEOJSON,
            distance_m=2400,
            eta_min=12,
            safety_score=98,
            coverage="mock",
            reasons=[
                "Mock safest route for demo",
                "Well-lit main avenues (placeholder)",
            ],
        ),
        shortest=RouteData(
            geojson=MOCK_SHORTEST_GEOJSON,
            distance_m=1800,
            eta_min=9,
            safety_score=45,
            coverage="mock",
            reasons=[
                "Mock shortest route for demo",
                "Some unlit segments (placeholder)",
            ],
        ),
    )

    # --- Phase 2 (later): real engine (uncomment when ready) ---
    # return routing_engine.compare_routes(
    #     start=start,
    #     end=end,
    #     weights=weights,
    #     mode=req.mode,
    #     max_detour=req.maxDetour,
    #     use_cctv=req.useCctv,
    # )
