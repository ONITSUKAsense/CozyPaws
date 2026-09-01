import json
import logging
import time
import uuid
from typing import Iterator

from langchain_core.messages import HumanMessage

from app.agent.graph import build_agent
from app.config import get_settings

logger = logging.getLogger(__name__)


def sse_frame(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


def _extract_sources(tool_output: str) -> list[dict]:
    """Parse tool JSON output into frontend source cards (id/name/price/categoryName/score)."""
    try:
        data = json.loads(tool_output)
    except (json.JSONDecodeError, TypeError):
        return []

    items: list[dict] = []
    for p in data.get("products") or []:
        if not isinstance(p, dict):
            continue
        items.append(
            {
                "id": p.get("id"),
                "name": p.get("name"),
                "price": p.get("price"),
                "categoryName": p.get("category"),
                "score": p.get("score"),
            }
        )
    product = data.get("product")
    if isinstance(product, dict):
        items.append(
            {
                "id": product.get("id"),
                "name": product.get("name"),
                "price": product.get("price"),
                "categoryName": product.get("category"),
            }
        )
    return items


class RAGService:
    _instance: "RAGService | None" = None

    def __init__(self) -> None:
        self._agent = None

    @classmethod
    def get(cls) -> "RAGService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _ensure_agent(self):
        if self._agent is None:
            self._agent = build_agent(with_memory=False)
            logger.info("LangGraph agent loaded")
        return self._agent

    def stream_chat(self, message: str, session_id: str | None, message_id: str | None) -> Iterator[str]:
        """Yield SSE frames for a LangGraph agent turn (tools + streamed answer)."""
        settings = get_settings()
        session_id = session_id or uuid.uuid4().hex
        response_message_id = message_id or uuid.uuid4().hex
        started = time.monotonic()

        yield sse_frame("meta", {
            "session_id": session_id,
            "response_message_id": response_message_id,
        })

        try:
            graph = self._ensure_agent()
            config = {"configurable": {"thread_id": session_id}}
            pending_calls: dict[str, dict] = {}
            tool_calls: list[dict] = []
            sources: list[dict] = []
            seen_ids: set = set()

            for mode, value in graph.stream(
                {"messages": [HumanMessage(content=message)]},
                config,
                stream_mode=["messages", "updates"],
            ):
                if mode == "updates":
                    for node_name, update in (value or {}).items():
                        msgs = (update or {}).get("messages") or []
                        if not msgs:
                            continue
                        if node_name == "agent":
                            last = msgs[-1]
                            for call in getattr(last, "tool_calls", []) or []:
                                cid = call.get("id")
                                if cid:
                                    pending_calls[cid] = {
                                        "name": call.get("name", ""),
                                        "input": call.get("args", {}),
                                    }
                        elif node_name == "tools":
                            for msg in msgs:
                                if getattr(msg, "type", "") != "tool":
                                    continue
                                call = pending_calls.get(msg.tool_call_id, {})
                                tool_calls.append(
                                    {
                                        "name": call.get("name") or getattr(msg, "name", ""),
                                        "input": call.get("input", {}),
                                    }
                                )
                                yield sse_frame("tool", {
                                    "name": tool_calls[-1]["name"],
                                    "input": json.dumps(tool_calls[-1]["input"], ensure_ascii=False),
                                    "output_summary": str(msg.content)[:500],
                                })
                                for src in _extract_sources(msg.content):
                                    if src.get("id") is not None and src["id"] not in seen_ids:
                                        seen_ids.add(src["id"])
                                        sources.append(src)
                elif mode == "messages":
                    chunk, meta = value
                    if meta.get("langgraph_node") == "agent":
                        content = getattr(chunk, "content", None)
                        if isinstance(content, str) and content:
                            yield sse_frame("token", {"delta": content})

            if sources:
                yield sse_frame("sources", {"products": sources})
            yield sse_frame("done", {
                "message_id": response_message_id,
                "latency_ms": int((time.monotonic() - started) * 1000),
                "tool_calls": len(tool_calls),
            })
        except Exception as e:
            logger.exception("Agent chat failed")
            yield sse_frame("error", {"code": "internal", "message": str(e)})
