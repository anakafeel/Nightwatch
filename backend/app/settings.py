import os
from pathlib import Path

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
