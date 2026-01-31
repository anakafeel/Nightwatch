from pydantic import BaseModel
from typing import Optional


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
