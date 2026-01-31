from fastapi import APIRouter
from app.api.schemas import RouteRequest, RouteResult
from app.services.router import compare_routes as compare_routes_service

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/route/compare", response_model=RouteResult)
def compare_routes(request: RouteRequest):
    return compare_routes_service(request)
