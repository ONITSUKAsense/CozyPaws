#!/bin/sh
# CozyPaws AI 服务启动入口：准备数据后启动 uvicorn。
set -e
cd /app

echo "==> 1/3 导出商品快照（重试直到 MySQL 就绪）"
for i in 1 2 3 4 5; do
  if python scripts/export_products.py; then
    break
  fi
  echo "   导出失败，5s 后重试 ($i/5) ..."
  sleep 5
done

echo "==> 2/3 确保 BGE 向量模型就绪"
python - <<'PY'
import os
from huggingface_hub import snapshot_download

model = os.environ.get("EMBEDDING_MODEL", "BAAI/bge-small-zh-v1.5")
local = os.environ.get("MODEL_DIR", "/models")
marker = os.path.join(local, "model.safetensors")
if not os.path.isfile(marker):
    print(f"   下载模型 {model} -> {local}（经 HF_ENDPOINT 镜像）")
    snapshot_download(repo_id=model, local_dir=local)
else:
    print(f"   模型已存在 {local}，跳过下载")
PY

echo "==> 3/3 幂等重建 Chroma 索引"
if [ -z "$(ls -A /data/chroma 2>/dev/null)" ]; then
  python scripts/reindex.py
else
  echo "   Chroma 索引已存在，跳过"
fi

echo "==> 启动 AI 服务 :8000"
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
