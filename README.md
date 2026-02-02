![Nightwatch App](https://github.com/user-attachments/assets/33e223f9-de34-4883-b40c-2d8b41af8b04)

# Nightwatch

Safe navigation for nighttime walks. Finds routes that maximize streetlight coverage instead of just the fastest path.

## Quick Start

### Backend

**One command (recommended):**

```bash
# macOS/Linux/WSL
./backend/scripts/run_backend.sh

# Windows PowerShell
.\backend\scripts\run_backend.ps1
```

This creates the venv, installs dependencies, and starts the server automatically.

> **Note:** If PowerShell blocks script execution, run:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

**Manual setup (alternative):**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate      # macOS/Linux/WSL
# .venv\Scripts\Activate.ps1   # Windows PowerShell
pip install -r requirements.txt
DEMO_MODE=0 uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

> **Note:** `DEMO_MODE=1` uses mock data for quick testing. `DEMO_MODE=0` uses real OpenStreetMap routing.

### Frontend

```bash
cd frontend
cp env.local.example .env.local
npm i && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify It's Running

- Health check: [http://127.0.0.1:8000/v1/health](http://127.0.0.1:8000/v1/health)
- API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Algorithm

The routing engine scores paths based on streetlight density along the route.

![Route Visualization](https://github.com/user-attachments/assets/019d26dd-d166-4eb5-aa5b-2ee25f752381)

## Project Structure

```
frontend/                 → Next.js app
backend/app/api/          → API routes
backend/app/services/     → Business logic + routing_engine.py
backend/app/data/         → Data layer
backend/scripts/          → Utility scripts
design/                   → Design mockups
```

---

## Dev Checklist (Claude)

- [ ] README.md — fixed markdown rendering, cleaned up structure
- [ ] frontend/package.json — added framer-motion dependency
- [ ] frontend/src/lib/motion.ts — motion variants + reduced motion util
- [ ] frontend/src/app/page.tsx — landing page fade/slide animations
- [ ] frontend/src/components/layout/AppNav.tsx — dropdown animation
- [ ] frontend/src/app/saved/page.tsx — route card hover animations
