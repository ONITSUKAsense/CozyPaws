import sqlite3
from pathlib import Path

from app.config import get_settings

_checkpointer = None


def get_checkpointer():
    """Shared persistent checkpointer backed by SQLite (phase 3 memory)."""
    global _checkpointer
    if _checkpointer is None:
        from langgraph.checkpoint.sqlite import SqliteSaver

        s = get_settings()
        Path(s.sqlite_db).parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(s.sqlite_db, check_same_thread=False)
        _checkpointer = SqliteSaver(conn)
    return _checkpointer
