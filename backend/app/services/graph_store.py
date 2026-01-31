"""
Graph store stub (Person A will implement).

Responsibilities later:
- load graph from app/data/
- cache it in memory
- expose a stable function for routing_engine
"""

from typing import Any, Optional

_GRAPH: Optional[Any] = None


def get_graph() -> Optional[Any]:
    """Return cached graph if loaded, else None."""
    return _GRAPH


def load_graph() -> Optional[Any]:
    """
    Load and cache graph from disk.
    For now: return None (no real data yet).
    """
    global _GRAPH
    _GRAPH = None
    return _GRAPH
