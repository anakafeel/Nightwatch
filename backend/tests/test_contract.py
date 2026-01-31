import json
from pathlib import Path
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

SAMPLE_PAYLOAD_PATH = (
    Path(__file__).resolve().parents[2]
    / "shared"
    / "sample_payloads"
    / "compare.json"
)



def test_health():
    response = client.get("/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_route_compare_contract():
    payload = json.loads(SAMPLE_PAYLOAD_PATH.read_text())
    response = client.post("/v1/route/compare", json=payload)

    assert response.status_code == 200
    data = response.json()

    # Top-level keys
    assert "safest" in data
    assert "shortest" in data

    # RouteData keys for safest
    for key in ["geojson", "distance_m", "eta_min", "safety_score", "coverage", "reasons"]:
        assert key in data["safest"], f"Missing key: safest.{key}"
        assert key in data["shortest"], f"Missing key: shortest.{key}"

    # Type checks
    assert isinstance(data["safest"]["geojson"], dict)
    assert isinstance(data["safest"]["distance_m"], int)
    assert isinstance(data["safest"]["eta_min"], int)
    assert isinstance(data["safest"]["safety_score"], int)
    assert isinstance(data["safest"]["coverage"], str)
    assert isinstance(data["safest"]["reasons"], list)
