# Pathify

Safe nighttime navigation platform.

## Quick Start

**Frontend:**
```bash
cd frontend && npm i && npm run dev
```

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Structure

- `frontend/` - Next.js app (Person D)
- `backend/app/api/` - API routes (Person C)
- `backend/app/services/` - Business logic (Person C)
- `backend/app/data/` - Data layer (Person A)
- `backend/scripts/` - Utility scripts (Person A)
- `backend/app/services/routing_engine.py` - Routing algorithm (Person B)
- `design/` - Design mockups
