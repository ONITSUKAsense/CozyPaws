from langchain_chroma import Chroma
from langchain_core.documents import Document

from app.config import get_settings
from app.rag.embedder import create_embeddings


class ProductRetriever:
    def __init__(self) -> None:
        s = get_settings()
        self._store = Chroma(
            collection_name=s.chroma_collection,
            persist_directory=s.chroma_dir,
            embedding_function=create_embeddings(),
        )

    def search(
        self, query: str, k: int = 4, category: str | None = None
    ) -> list[tuple[Document, float]]:
        """Return (document, relevance_score) pairs, best first."""
        kwargs: dict = {"query": query, "k": k}
        if category:
            kwargs["filter"] = {"category": category}
        return self._store.similarity_search_with_relevance_scores(**kwargs)

    def count(self) -> int:
        return self._store._collection.count()
