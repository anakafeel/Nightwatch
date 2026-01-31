# Pathify Backend

FastAPI backend for route comparison.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

## Endpoints

- Health: `GET http://localhost:8000/v1/health`
- Compare: `POST http://localhost:8000/v1/route/compare`

## Test

```bash
# Health check
curl http://localhost:8000/v1/health

# Route compare (using sample payload)
curl -X POST http://localhost:8000/v1/route/compare \
  -H "Content-Type: application/json" \
  -d @../shared/sample_payloads/compare.json
```

## Run Tests

```bash
pip install pytest httpx
pytest tests/
```
