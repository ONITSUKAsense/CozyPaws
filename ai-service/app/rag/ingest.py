import json
from pathlib import Path

from langchain_chroma import Chroma
from langchain_core.documents import Document

from app.config import get_settings
from app.rag.embedder import create_embeddings


def load_products(path: str | Path) -> list[dict]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def product_to_document(p: dict) -> Document:
    lines = [
        f"商品名称：{p['name']}",
        f"分类：{p.get('category_name') or '未分类'}",
        f"价格：¥{float(p.get('price') or 0):.2f}",
        f"库存：{p.get('stock')}",
    ]
    if p.get("description"):
        lines.append(f"描述：{p['description']}")

    return Document(
        page_content="\n".join(lines),
        metadata={
            "id": p["id"],
            "name": p["name"],
            "slug": p.get("slug", ""),
            "category": p.get("category_name") or "",
            "price": float(p.get("price") or 0),
            "stock": int(p.get("stock") or 0),
        },
    )


def build_index(products: list[dict]) -> Chroma:
    s = get_settings()
    docs = [product_to_document(p) for p in products]
    if not docs:
        raise ValueError("no products to index")
    return Chroma.from_documents(
        documents=docs,
        embedding=create_embeddings(),
        collection_name=s.chroma_collection,
        persist_directory=s.chroma_dir,
    )
