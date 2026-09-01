import json
import logging
import time
import uuid
from typing import Iterator

from app.config import get_settings
from app.rag.chain import build_llm, stream_answer
from app.rag.retriever import ProductRetriever

logger = logging.getLogger(__name__)


def sse_frame(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


class RAGService:
    _instance: "RAGService | None" = None

    def __init__(self) -> None:
        self._retriever: ProductRetriever | None = None
        self._llm = None

    @classmethod
    def get(cls) -> "RAGService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _ensure_loaded(self):
        if self._retriever is None:
            self._retriever = ProductRetriever()
            logger.info("ProductRetriever loaded (index docs=%d)", self._retriever.count())
        if self._llm is None:
            self._llm = build_llm()
            logger.info("LLM loaded: %s", get_settings().deepseek_model)
        return self._retriever, self._llm

    def stream_chat(self, message: str, session_id: str | None, message_id: str | None) -> Iterator[str]:
        """Yield SSE frames for a single-turn RAG answer."""
        settings = get_settings()
        session_id = session_id or uuid.uuid4().hex
        response_message_id = message_id or uuid.uuid4().hex
        started = time.monotonic()

        yield sse_frame("meta", {
            "session_id": session_id,
            "response_message_id": response_message_id,
        })

        try:
            retriever, llm = self._ensure_loaded()
            results = retriever.search(message, k=4)
            docs = [doc for doc, _ in results]

            sources = [
                {
                    "id": doc.metadata.get("id"),
                    "name": doc.metadata.get("name"),
                    "price": doc.metadata.get("price"),
                    "categoryName": doc.metadata.get("category"),
                    "score": round(score, 4),
                }
                for doc, score in results
            ]
            yield sse_frame("sources", {"products": sources})

            for delta in stream_answer(llm, message, docs, lang="zh"):
                yield sse_frame("token", {"delta": delta})

            yield sse_frame("done", {
                "message_id": response_message_id,
                "latency_ms": int((time.monotonic() - started) * 1000),
                "tool_calls": 0,
            })
        except Exception as e:
            logger.exception("RAG chat failed")
            yield sse_frame("error", {"code": "internal", "message": str(e)})
