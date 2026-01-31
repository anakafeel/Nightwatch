import os


def demo_mode() -> bool:
    """
    DEMO_MODE=1 -> always return mock responses (hackathon-safe)
    DEMO_MODE=0 -> allow real graph/routing calls
    """
    return os.getenv("DEMO_MODE", "1").strip().lower() in ("1", "true", "yes", "on")
