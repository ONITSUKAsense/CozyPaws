"""Run RAGAS evaluation over the product dataset; write metrics.json + metrics.md.

Usage:
    python -m eval.run_eval --limit 5          # offline (golden answers)
    python -m eval.run_eval --live --limit 5   # collect real agent answers first
"""
import argparse
import json
import re
import time
from pathlib import Path

import pandas as pd

from app.config import get_settings
from app.rag.chain import build_llm
from app.rag.embedder import create_embeddings


def _parse_stream(frames: list[str]) -> tuple[str, list[dict]]:
    """Reassemble answer + source products from SSE frames."""
    answer_parts: list[str] = []
    sources: list[dict] = []
    for frame in frames:
        if not frame.startswith("event:"):
            continue
        lines = frame.splitlines()
        event = lines[0].split(":", 1)[1].strip()
        data_line = next((l for l in lines if l.startswith("data:")), None)
        if data_line is None:
            continue
        data = json.loads(data_line.split(":", 1)[1].strip())
        if event == "token":
            answer_parts.append(data.get("delta", ""))
        elif event == "sources":
            sources = data.get("products", []) or []
    return "".join(answer_parts), sources


def _product_text_by_id(product_id: int) -> str:
    s = get_settings()
    data = json.loads(Path(s.products_json).read_text(encoding="utf-8"))
    items = data if isinstance(data, list) else data.get("products", [])
    for p in items:
        if p["id"] == product_id:
            parts = [f"商品名：{p['name']}", f"分类：{p['category_name']}", f"价格：¥{p['price']}"]
            if p.get("description"):
                parts.append(f"描述：{p['description']}")
            if p.get("stock") is not None:
                parts.append(f"库存：{p['stock']} 件")
            return "；".join(parts)
    return ""


def _live_collect(samples: list[dict]) -> list[dict]:
    from app.rag.service import RAGService

    svc = RAGService.get()
    enriched = []
    for s in samples:
        frames = list(svc.stream_chat(s["user_input"], "ragas-eval", None))
        answer, sources = _parse_stream(frames)
        contexts = [_product_text_by_id(p["id"]) for p in sources if p.get("id") is not None]
        enriched.append(
            {
                "user_input": s["user_input"],
                "response": answer or s["response"],
                "retrieved_contexts": contexts or s["retrieved_contexts"],
                "reference": s["reference"],
            }
        )
    return enriched


def main() -> None:
    import sys

    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

    parser = argparse.ArgumentParser(description="RAGAS evaluation for CozyPaws AI")
    parser.add_argument("--limit", type=int, default=None, help="max samples to evaluate")
    parser.add_argument("--live", action="store_true", help="collect real agent answers first")
    args = parser.parse_args()

    from app.tracing import enable_tracing

    enable_tracing()

    from app.compat import install_ragas_shims

    install_ragas_shims()

    from ragas import EvaluationDataset, evaluate
    from ragas.dataset_schema import SingleTurnSample
    from ragas.metrics import (
        Faithfulness,
        LLMContextPrecisionWithoutReference,
        LLMContextRecall,
        ResponseRelevancy,
    )
    from ragas.llms import LangchainLLMWrapper
    from ragas.embeddings import LangchainEmbeddingsWrapper

    from eval.dataset import build_dataset

    s = get_settings()
    samples = build_dataset(args.limit)
    if args.live:
        samples = _live_collect(samples)

    judge = LangchainLLMWrapper(build_llm())
    embeddings = LangchainEmbeddingsWrapper(create_embeddings())

    dataset = EvaluationDataset(samples=[SingleTurnSample(**sm) for sm in samples])
    metrics = [
        Faithfulness(),
        ResponseRelevancy(),
        LLMContextRecall(),
        LLMContextPrecisionWithoutReference(),
    ]

    print(f"Evaluating {len(samples)} samples with RAGAS ...")
    started = time.monotonic()
    result = evaluate(dataset=dataset, metrics=metrics, llm=judge, embeddings=embeddings)
    elapsed = time.monotonic() - started

    df = result.to_pandas()
    out_dir = Path(s.data_dir) / "eval"
    out_dir.mkdir(parents=True, exist_ok=True)

    metrics_json = {}
    for name in df.columns:
        col = pd.to_numeric(df[name], errors="coerce").dropna()
        values = col.round(4).tolist()
        metrics_json[name] = {
            "mean": round(float(col.mean()), 4) if len(col) else None,
            "values": values,
        }
    metrics_json["meta"] = {
        "samples": len(samples),
        "live": args.live,
        "elapsed_s": round(elapsed, 1),
        "judge_model": s.deepseek_model,
    }
    (out_dir / "metrics.json").write_text(
        json.dumps(metrics_json, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    md = ["# RAGAS 评估报告\n", f"- 样本数：{len(samples)}", f"- 模式：{'live（真实回答）' if args.live else 'offline（金标答案）'}",
          f"- Judge 模型：{s.deepseek_model}", f"- 耗时：{elapsed:.1f}s\n",
          "| 指标 | 均值 |", "|------|------|"]
    for name, m in metrics_json.items():
        if name != "meta":
            md.append(f"| {name} | {m['mean']} |")
    md.append("\n## 逐样本\n")
    md.append("| 样本 | 问题 | " + " | ".join(c for c in df.columns) + " |")
    md.append("|------|------|" + "------|" * len(df.columns))
    for i, row in df.iterrows():
        vals = [f"{v:.3f}" if isinstance(v, float) else str(v) for v in row.tolist()]
        q = (samples[i]["user_input"] if i < len(samples) else "")[:24]
        md.append(f"| {i} | {q} | " + " | ".join(vals) + " |")
    (out_dir / "metrics.md").write_text("\n".join(md), encoding="utf-8")

    print((out_dir / "metrics.md").read_text(encoding="utf-8"))
    print(f"\n报告已写入: {out_dir}")


if __name__ == "__main__":
    main()
