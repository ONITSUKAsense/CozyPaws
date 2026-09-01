from typing import Any, Literal

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    session_id: str | None = None
    message_id: str | None = None


class SSEMeta(BaseModel):
    event: Literal["meta"] = "meta"
    session_id: str
    response_message_id: str


class SSESources(BaseModel):
    event: Literal["sources"] = "sources"
    products: list[dict[str, Any]]


class SSETool(BaseModel):
    event: Literal["tool"] = "tool"
    name: str
    input: str
    output_summary: str


class SSEToken(BaseModel):
    event: Literal["token"] = "token"
    delta: str


class SSEDone(BaseModel):
    event: Literal["done"] = "done"
    message_id: str
    latency_ms: int
    tool_calls: int = 0


class SSEError(BaseModel):
    event: Literal["error"] = "error"
    code: str
    message: str
