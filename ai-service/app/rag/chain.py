from langchain_core.documents import Document
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI

from app.config import get_settings
from app.rag.prompt import build_messages


def build_llm() -> ChatOpenAI:
    s = get_settings()
    return ChatOpenAI(
        model=s.deepseek_model,
        api_key=s.deepseek_api_key,
        base_url=s.deepseek_base_url,
        temperature=s.llm_temperature,
        max_tokens=s.llm_max_tokens,
        streaming=True,
    )


def format_docs(docs: list[Document]) -> str:
    return "\n\n".join(doc.page_content for doc in docs)


def to_llm_messages(messages: list[dict]):
    out = []
    for m in messages:
        if m["role"] == "system":
            out.append(SystemMessage(content=m["content"]))
        else:
            out.append(HumanMessage(content=m["content"]))
    return out


def stream_answer(llm: ChatOpenAI, question: str, docs: list[Document], lang: str = "zh"):
    """Yield text chunks answering `question` from `docs`."""
    messages = build_messages(lang, format_docs(docs), question)
    for chunk in llm.stream(to_llm_messages(messages)):
        content = getattr(chunk, "content", "")
        if content:
            yield content
