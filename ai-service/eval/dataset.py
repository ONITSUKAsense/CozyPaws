"""Build an offline RAGAS evaluation dataset from the real product snapshot."""
import json
from pathlib import Path

from app.config import get_settings

_TEMPLATES = [
    "请推荐{category}里的「{name}」，介绍一下它的特点和价格。",
    "我想买{name}，多少钱，还有货吗？",
    "有什么适合{category}的商品？推荐一个：{name}。",
]


def _product_text(p: dict) -> str:
    parts = [f"商品名：{p['name']}", f"分类：{p['category_name']}", f"价格：¥{p['price']}"]
    if p.get("description"):
        parts.append(f"描述：{p['description']}")
    if p.get("stock") is not None:
        parts.append(f"库存：{p['stock']} 件")
    return "；".join(parts)


def _golden_answer(p: dict) -> str:
    return _product_text(p).replace("；", "。").replace("。。", "。")


def build_dataset(limit: int | None = None) -> list[dict]:
    s = get_settings()
    data = json.loads(Path(s.products_json).read_text(encoding="utf-8"))
    items = data if isinstance(data, list) else data.get("products", [])
    if limit:
        items = items[:limit]

    samples = []
    for i, p in enumerate(items):
        question = _TEMPLATES[i % len(_TEMPLATES)].format(category=p["category_name"], name=p["name"])
        context = _product_text(p)
        samples.append(
            {
                "user_input": question,
                "response": _golden_answer(p),
                "retrieved_contexts": [context],
                "reference": context,
            }
        )
    return samples


def main() -> None:
    s = get_settings()
    out = Path(s.data_dir) / "eval" / "dataset.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    samples = build_dataset()
    out.write_text(json.dumps(samples, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {len(samples)} samples to {out}")


if __name__ == "__main__":
    main()
