"""Compatibility shims for ragas 0.4.x + langchain-community>=0.4.

ragas 0.4.3 unconditionally imports Google VertexAI providers from
langchain-community, but langchain-community 0.4.x removed those modules. We
never use a Google provider (the judge is DeepSeek via ChatOpenAI), so inject
lightweight stand-ins into sys.modules BEFORE importing ragas.
"""

import sys
import types


def install_ragas_shims() -> None:
    if "langchain_community.chat_models.vertexai" in sys.modules:
        return

    import langchain_community.chat_models as chat_models
    import langchain_community.llms as llms

    vertexai_chat = types.ModuleType("langchain_community.chat_models.vertexai")
    vertexai_chat.ChatVertexAI = type("ChatVertexAI", (), {})
    sys.modules["langchain_community.chat_models.vertexai"] = vertexai_chat
    chat_models.vertexai = vertexai_chat

    llms.VertexAI = type("VertexAI", (), {})
