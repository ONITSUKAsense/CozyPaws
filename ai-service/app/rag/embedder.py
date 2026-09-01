import os

from langchain_huggingface import HuggingFaceEmbeddings

from app.config import get_settings

# Query instruction recommended for BGE-zh models to improve retrieval.
_BGE_QUERY_INSTRUCTION = "为这个句子生成表示以用于检索相关文章："


def _apply_hf_endpoint() -> None:
    """Propagate HF_ENDPOINT from our settings into os.environ so that
    huggingface_hub resolves the right mirror (China network)."""
    s = get_settings()
    if s.hf_endpoint:
        os.environ.setdefault("HF_ENDPOINT", s.hf_endpoint)


def create_embeddings() -> HuggingFaceEmbeddings:
    _apply_hf_endpoint()
    s = get_settings()

    model_name = s.model_dir or s.embedding_model
    model_kwargs: dict = {"device": "cpu"}
    if s.model_dir:
        # Pre-downloaded local snapshot — do not hit the network.
        model_kwargs["local_files_only"] = True

    return HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs=model_kwargs,
        encode_kwargs={"normalize_embeddings": True},
        query_encode_kwargs={"prompt": _BGE_QUERY_INSTRUCTION},
    )
