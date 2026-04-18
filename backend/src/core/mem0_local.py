"""Local Mem0 integration — replaces the separate mem0-service Docker container.

Provides a singleton mem0.Memory instance and helper functions for:
  - embed(text) → vector
  - add_memory(messages, user_id, ...) → response
  - search_memories(query, user_id, ...) → results
  - get_all_memories(user_id) → memories
  - get_memory(memory_id) → memory
  - update_memory(memory_id, data) → response
  - delete_memory(memory_id)
  - delete_all_memories(user_id)
"""

import logging
import os
from pathlib import Path

from mem0 import Memory

logger = logging.getLogger(__name__)

_memory_instance: Memory | None = None


def _build_config() -> dict:
    """Build mem0 config from environment variables (mirrors mem0-service/main.py)."""
    qdrant_host = os.environ.get("QDRANT_HOST", "qdrant")
    qdrant_port = int(os.environ.get("QDRANT_PORT", "6333"))
    qdrant_collection = os.environ.get("QDRANT_COLLECTION", "mem0_memories")
    embedding_dim = int(
        os.environ.get("EMBEDDING_DIMENSION")
        or os.environ.get("EMBEDDING_DIM")
        or "384"
    )

    llm_provider = os.environ.get("LLM_PROVIDER", "openai")
    llm_model = os.environ.get("LLM_MODEL", "openai/gpt-4o-mini")
    embedder_provider = os.environ.get("EMBEDDER_PROVIDER", "huggingface")
    embedder_model = (
        os.environ.get("EMBEDDER_MODEL")
        or os.environ.get("EMBEDDING_MODEL")
        or "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )

    openai_api_key = os.environ.get("OPENAI_API_KEY")
    openai_base_url = os.environ.get("OPENAI_BASE_URL")
    openrouter_api_key = os.environ.get("OPENROUTER_API_KEY")
    openrouter_api_base = os.environ.get("OPENROUTER_API_BASE")
    hf_token = os.environ.get("HF_TOKEN")

    history_db_path = os.environ.get("HISTORY_DB_PATH", "/tmp/chatsnp/history.db")
    Path(history_db_path).parent.mkdir(parents=True, exist_ok=True)

    api_key = openrouter_api_key or openai_api_key

    config = {
        "version": "v1.1",
        "vector_store": {
            "provider": "qdrant",
            "config": {
                "host": qdrant_host,
                "port": qdrant_port,
                "collection_name": qdrant_collection,
                "embedding_model_dims": embedding_dim,
            },
        },
        "llm": {
            "provider": llm_provider,
            "config": {
                "api_key": api_key,
                "openai_base_url": openai_base_url or openrouter_api_base,
                "temperature": 0.2,
                "model": llm_model,
            },
        },
        "embedder": {
            "provider": embedder_provider,
            "config": {
                "api_key": api_key,
                "openai_base_url": openai_base_url or openrouter_api_base,
                "model": embedder_model,
                "embedding_dims": embedding_dim,
                "output_dimensionality": embedding_dim,
                **(
                    {"model_kwargs": {"token": hf_token}}
                    if embedder_provider == "huggingface" and hf_token
                    else {}
                ),
            },
        },
        "history_db_path": history_db_path,
    }

    return config


def get_memory() -> Memory:
    """Return a singleton mem0.Memory instance (lazy init)."""
    global _memory_instance  # noqa: PLW0603
    if _memory_instance is None:
        config = _build_config()
        logger.info("[mem0-local] Initializing mem0.Memory with config...")
        _memory_instance = Memory.from_config(config)
        # Disable graph processing (same as mem0-service)
        _memory_instance.enable_graph = False
        _memory_instance.graph = None
        logger.info("[mem0-local] mem0.Memory initialized successfully.")
    return _memory_instance


# ---------------------------------------------------------------------------
# Convenience helpers (replace HTTP calls to mem0-service)
# ---------------------------------------------------------------------------


def embed(text: str) -> list[float]:
    """Generate embedding vector for text using mem0's configured embedder."""
    mem = get_memory()
    return mem.embedding_model.embed(text, "search")


def add_memory(
    messages: list[dict],
    user_id: str | None = None,
    agent_id: str | None = None,
    run_id: str | None = None,
    metadata: dict | None = None,
) -> dict:
    """Store new memories. Equivalent to POST /memories."""
    mem = get_memory()
    params = {}
    if user_id:
        params["user_id"] = user_id
    if agent_id:
        params["agent_id"] = agent_id
    if run_id:
        params["run_id"] = run_id
    if metadata:
        params["metadata"] = metadata
    return mem.add(messages=messages, **params)


def search_memories(
    query: str,
    user_id: str | None = None,
    agent_id: str | None = None,
    run_id: str | None = None,
    limit: int = 5,
) -> dict:
    """Search memories. Equivalent to POST /search."""
    mem = get_memory()
    params = {}
    if user_id:
        params["user_id"] = user_id
    if agent_id:
        params["agent_id"] = agent_id
    if run_id:
        params["run_id"] = run_id
    params["limit"] = min(limit, 10)
    return mem.search(query=query, **params)


def get_all_memories(
    user_id: str | None = None,
    agent_id: str | None = None,
    run_id: str | None = None,
) -> list:
    """Retrieve all memories for a given identifier. Equivalent to GET /memories."""
    mem = get_memory()
    params = {}
    if user_id:
        params["user_id"] = user_id
    if agent_id:
        params["agent_id"] = agent_id
    if run_id:
        params["run_id"] = run_id
    return mem.get_all(**params)


def get_memory_by_id(memory_id: str) -> dict:
    """Get a specific memory by ID. Equivalent to GET /memories/{id}."""
    mem = get_memory()
    return mem.get(memory_id)


def update_memory(memory_id: str, data: dict) -> dict:
    """Update a memory. Equivalent to PUT /memories/{id}."""
    mem = get_memory()
    return mem.update(memory_id=memory_id, data=data)


def delete_memory(memory_id: str) -> None:
    """Delete a specific memory. Equivalent to DELETE /memories/{id}."""
    mem = get_memory()
    mem.delete(memory_id=memory_id)


def delete_all_memories(
    user_id: str | None = None,
    agent_id: str | None = None,
    run_id: str | None = None,
) -> None:
    """Delete all memories for a given identifier."""
    mem = get_memory()
    params = {}
    if user_id:
        params["user_id"] = user_id
    if agent_id:
        params["agent_id"] = agent_id
    if run_id:
        params["run_id"] = run_id
    mem.delete_all(**params)
