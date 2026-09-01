from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.api.schemas import ChatRequest
from app.rag.service import RAGService

router = APIRouter(prefix="/v1")


@router.get("/health")
def health():
    from app.config import get_settings

    return {"status": "ok", "service": get_settings().app_name}


@router.post("/chat")
def chat(req: ChatRequest):
    service = RAGService.get()

    def gen():
        yield from service.stream_chat(
            message=req.message,
            session_id=req.session_id,
            message_id=req.message_id,
        )

    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    from app.agent.memory import get_checkpointer

    get_checkpointer().delete_thread(session_id)
    return {"deleted": session_id}
