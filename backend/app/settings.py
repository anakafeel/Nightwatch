import os
from pathlib import Path
from typing import List

try:
    from dotenv import load_dotenv  # type: ignore
    # backend/app/settings.py -> backend/.env
    env_path = Path(__file__).resolve().parents[1] / ".env"
    load_dotenv(dotenv_path=env_path)
except Exception:
    pass


def demo_mode() -> bool:
    """
    DEMO_MODE=1 -> always return mock responses (hackathon-safe)
    DEMO_MODE=0 -> allow real graph/routing calls
    """
    val = os.getenv("DEMO_MODE", "1").strip().lower()
    print("[settings] DEMO_MODE =", val)
    return val in ("1", "true", "yes", "on")


def get_cors_origins() -> List[str]:
    """
    Parse CORS_ORIGINS from env (comma-separated).
    Defaults to localhost origins for local development.
    """
    default = "http://localhost:3000,http://127.0.0.1:3000"
    raw = os.getenv("CORS_ORIGINS", default)
    origins = [o.strip() for o in raw.split(",") if o.strip()]
    print("[settings] CORS_ORIGINS =", origins)
    return origins


def get_port() -> int:
    """Get port from PORT env var (Render sets this), default 8000."""
    return int(os.getenv("PORT", "8000"))
