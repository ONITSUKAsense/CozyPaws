"""Export products from the CozyPaws MySQL database to a JSON snapshot.

Usage (from the ai-service/ directory):
    python scripts/export_products.py
"""
import json
import sys
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pymysql

from app.config import get_settings


def _to_jsonable(value):
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    return value


def fetch_products() -> list[dict]:
    s = get_settings()
    conn = pymysql.connect(
        host=s.mysql_host,
        port=s.mysql_port,
        user=s.mysql_user,
        password=s.mysql_password,
        database=s.mysql_db,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT p.id, p.name, p.slug, p.description, p.price,
                       p.compare_price, p.stock, p.images, p.is_featured,
                       p.rating, p.review_count, c.name AS category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                ORDER BY p.id
                """
            )
            return [{k: _to_jsonable(v) for k, v in row.items()} for row in cur.fetchall()]
    finally:
        conn.close()


def main() -> None:
    s = get_settings()
    products = fetch_products()
    path = Path(s.products_json)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    print(f"Exported {len(products)} products -> {path}")


if __name__ == "__main__":
    main()
