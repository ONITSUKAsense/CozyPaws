"""Idempotently rebuild the Chroma product index from products.json.

Usage (from the ai-service/ directory):
    python scripts/reindex.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import chromadb

from app.config import get_settings
from app.rag.ingest import build_index, load_products


def main() -> None:
    s = get_settings()

    # Drop the old collection so re-runs are idempotent.
    client = chromadb.PersistentClient(path=s.chroma_dir)
    try:
        client.delete_collection(s.chroma_collection)
        print(f"Dropped old collection '{s.chroma_collection}'")
    except Exception:
        print(f"No existing collection '{s.chroma_collection}' to drop")

    products = load_products(s.products_json)
    if not products:
        print("No products found — run scripts/export_products.py first.")
        sys.exit(1)

    build_index(products)
    print(f"Indexed {len(products)} products into Chroma at {s.chroma_dir}")


if __name__ == "__main__":
    main()
