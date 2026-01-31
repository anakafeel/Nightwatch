from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# Mock data matching frontend expectations
MOCK_SAFEST_GEOJSON = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [-73.9857, 40.7484],
                [-73.9832, 40.7502],
                [-73.9798, 40.7521],
                [-73.9762, 40.7545],
                [-73.9734, 40.7568],
                [-73.9705, 40.7589],
                [-73.9678, 40.7612],
            ],
        },
        "properties": {"type": "safest", "name": "Safest Route"},
    }],
}

MOCK_SHORTEST_GEOJSON = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [-73.9857, 40.7484],
                [-73.982, 40.751],
                [-73.978, 40.754],
                [-73.9678, 40.7612],
            ],
        },
        "properties": {"type": "shortest", "name": "Shortest Route"},
    }],
}


class LatLng(BaseModel):
    lat: float
    lng: float


class SafetyWeights(BaseModel):
    lights: int
    cameras: int


class RouteRequest(BaseModel):
    start: LatLng
    end: LatLng
    mode: str = "night"
    maxDetour: int = 15
    weights: Optional[SafetyWeights] = None
    useCctv: bool = False


class RouteData(BaseModel):
    geojson: dict
    distance_m: int
    eta_min: int
    safety_score: int
    coverage: str
    reasons: list[str]


class RouteResult(BaseModel):
    safest: RouteData
    shortest: RouteData


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/route/compare", response_model=RouteResult)
def compare_routes(request: RouteRequest):
    return RouteResult(
        safest=RouteData(
            geojson=MOCK_SAFEST_GEOJSON,
            distance_m=2400,
            eta_min=12,
            safety_score=98,
            coverage="high",
            reasons=[
                "Well-lit main avenues",
                "High pedestrian activity",
                "12+ streetlights along route",
                "CCTV coverage at intersections",
            ],
        ),
        shortest=RouteData(
            geojson=MOCK_SHORTEST_GEOJSON,
            distance_m=1800,
            eta_min=9,
            safety_score=45,
            coverage="low",
            reasons=["Some unlit segments", "Lower foot traffic"],
        ),
    )
