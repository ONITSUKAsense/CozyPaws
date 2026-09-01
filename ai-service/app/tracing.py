"""LangSmith tracing setup (phase 5).

Tracing is opt-in: it only activates when LANGSMITH_TRACING=true and a
LANGSMITH_API_KEY is present. pydantic-settings does not propagate .env values
into os.environ automatically, but langchain/langsmith read tracing config from
os.environ, so we bridge the two here.
"""

import os

from app.config import get_settings


def enable_tracing() -> bool:
    s = get_settings()
    if not s.langsmith_tracing or not s.langsmith_api_key:
        return False
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    os.environ["LANGSMITH_TRACING"] = "true"
    os.environ["LANGSMITH_TRACING_V2"] = "true"
    os.environ["LANGSMITH_API_KEY"] = s.langsmith_api_key
    os.environ["LANGCHAIN_API_KEY"] = s.langsmith_api_key
    os.environ["LANGSMITH_PROJECT"] = s.langsmith_project
    os.environ["LANGCHAIN_PROJECT"] = s.langsmith_project
    return True
