# ===== CozyPaws AI 服务镜像 =====
# 基于 python:3.12-slim + torch CPU。启动入口 docker-entrypoint.sh 负责
# 导出商品快照、下载 BGE 模型、幂等重建 Chroma 索引，然后启动 uvicorn。
FROM python:3.12-slim

WORKDIR /app

# 编译型依赖 + torch CPU 运行时（libgomp1）
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ build-essential curl libgomp1 && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY scripts ./scripts
COPY eval ./eval
COPY docker-entrypoint.sh .

RUN chmod +x docker-entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
