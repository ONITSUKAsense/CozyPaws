import json

import requests
from langchain_core.tools import tool

from app.config import get_settings
from app.rag.retriever import ProductRetriever

_retriever_instance: ProductRetriever | None = None


def _retriever() -> ProductRetriever:
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = ProductRetriever()
    return _retriever_instance


def _backend_get(path: str) -> requests.Response:
    s = get_settings()
    return requests.get(f"{s.backend_url}{path}", timeout=8)


def _product_short(p: dict) -> dict:
    return {
        "id": p.get("id"),
        "name": p.get("name"),
        "category": p.get("categoryName"),
        "price": p.get("price"),
        "stock": p.get("stock"),
    }


@tool
def semantic_search(query: str) -> str:
    """在宠物商店商品库中进行语义检索，查找与用户问题相关的商品。

    当用户询问“有哪些 / 推荐 / 有什么商品”，或表达购买意图时使用。
    返回商品 JSON 列表（id、名称、分类、价格、库存、相关度）。"""
    results = _retriever().search(query, k=5)
    products = [
        {
            "id": d.metadata.get("id"),
            "name": d.metadata.get("name"),
            "category": d.metadata.get("category"),
            "price": d.metadata.get("price"),
            "stock": d.metadata.get("stock"),
            "score": round(score, 3),
        }
        for d, score in results
    ]
    return json.dumps({"products": products}, ensure_ascii=False)


@tool
def product_lookup(product_id: int) -> str:
    """按商品 ID 查询实时商品详情（价格、库存、描述）。

    当用户提到某个具体商品，或询问某个商品的价格/库存/是否在售时使用。
    返回单个商品的 JSON 对象。"""
    r = _backend_get(f"/api/products/{product_id}")
    if r.status_code != 200:
        return json.dumps({"error": f"未找到 ID={product_id} 的商品"}, ensure_ascii=False)
    p = r.json()
    return json.dumps(
        {
            "product": {
                "id": p.get("id"),
                "name": p.get("name"),
                "category": p.get("categoryName"),
                "price": p.get("price"),
                "stock": p.get("stock"),
                "description": p.get("description"),
            }
        },
        ensure_ascii=False,
    )


@tool
def category_products(category_name: str) -> str:
    """按分类名称列出该分类下的全部商品。

    当用户明确提到某个分类（例如“狗粮”“猫玩具”“鸟类”）时使用。
    返回该分类下商品 JSON 列表。"""
    cats = _backend_get("/api/categories")
    if cats.status_code != 200:
        return json.dumps({"error": "无法获取分类列表"}, ensure_ascii=False)
    cat_list = cats.json()
    cat_id = next((c["id"] for c in cat_list if c["name"] == category_name), None)
    if cat_id is None:
        names = ", ".join(c["name"] for c in cat_list)
        return json.dumps({"error": f"未找到分类「{category_name}」，可用分类：{names}"}, ensure_ascii=False)

    r = _backend_get(f"/api/products?categoryId={cat_id}&size=100")
    if r.status_code != 200:
        return json.dumps({"error": "获取商品失败"}, ensure_ascii=False)
    products = [_product_short(p) for p in r.json().get("content", [])]
    return json.dumps({"products": products}, ensure_ascii=False)


TOOLS = [semantic_search, product_lookup, category_products]
