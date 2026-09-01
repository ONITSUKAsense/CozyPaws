from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- Service ---
    app_name: str = "cozypaws-ai"
    host: str = "0.0.0.0"
    port: int = 8000

    # --- LLM (DeepSeek, OpenAI-compatible) ---
    deepseek_api_key: str = ""
    deepseek_base_url: str = "https://api.deepseek.com"
    deepseek_model: str = "deepseek-v4-flash"
    llm_temperature: float = 0.3
    llm_max_tokens: int = 1024

    # --- Embeddings (local BGE via sentence-transformers) ---
    embedding_model: str = "BAAI/bge-small-zh-v1.5"
    # Pre-downloaded local snapshot dir; when set, we load with local_files_only=True.
    model_dir: str = ""
    # HuggingFace Hub mirror for China network (e.g. https://hf-mirror.com).
    hf_endpoint: str = ""

    # --- Vector store (Chroma) ---
    chroma_dir: str = "./data/chroma"
    chroma_collection: str = "products"

    # --- Source data snapshot ---
    data_dir: str = "./data"
    products_json: str = "./data/products.json"

    # --- MySQL (only used by export/eval scripts) ---
    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_db: str = "cozypaws"
    mysql_user: str = "root"
    mysql_password: str = ""

    # --- Spring Boot backend REST (used by agent tools) ---
    backend_url: str = "http://localhost:8080"

    # --- LangSmith tracing ---
    langsmith_tracing: bool = False
    langsmith_api_key: str = ""
    langsmith_project: str = "cozypaws-ai"

    # --- CORS ---
    cors_origins: str = "http://localhost:5173,http://localhost:5174,http://localhost"

    # --- Memory (phase 3) ---
    sqlite_db: str = "./data/cozypaws_agent.db"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
