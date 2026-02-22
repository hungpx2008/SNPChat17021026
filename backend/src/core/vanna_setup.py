"""
Vanna Setup — Text-to-SQL with Unified Vietnamese Embedding.

EMBEDDING STRATEGY (unified):
  All components use Vietnamese_Embedding_v2 (1024 dim) via Mem0 /embed:
  - Vanna SQL schemas    → Qdrant: vanna_schemas_openai (1024 dim)
  - RAG document chunks  → Qdrant: port_knowledge (1024 dim)
  - Chat history chunks  → Qdrant: chat_chunks (1024 dim)
  - Long-term memory     → Qdrant: mem0_memories (1024 dim, managed by Mem0 SDK)

Uses lazy initialization to avoid crash when Postgres/Qdrant not ready at import time.
"""
import logging
import os

import httpx
from vanna.legacy.openai import OpenAI_Chat
from vanna.legacy.qdrant import Qdrant_VectorStore
from qdrant_client import QdrantClient
from src.core.config import get_settings
from sqlalchemy.engine.url import make_url

logger = logging.getLogger(__name__)

# Unified embedding: Vietnamese_Embedding_v2 (1024 dim) via Mem0 /embed
VANNA_EMBEDDING_DIM = 1024


class CustomVanna(Qdrant_VectorStore, OpenAI_Chat):
    def __init__(self, config=None):
        self._mem0_url = config.get("mem0_url", "http://mem0:8000")

        # Initialize OpenAI Chat (for LLM, NOT for embeddings)
        OpenAI_Chat.__init__(self, config=config)
        # Initialize Qdrant Store (triggers setup_collections -> generate_embedding)
        Qdrant_VectorStore.__init__(self, config=config)

    def generate_embedding(self, data: str, **kwargs) -> list[float]:
        """
        Generate embeddings via Mem0 /embed endpoint.
        Uses Vietnamese_Embedding_v2 (1024 dim) — same model as RAG/chat_chunks.
        """
        data = data.replace("\n", " ").strip()
        if not data:
            return [0.0] * VANNA_EMBEDDING_DIM

        try:
            with httpx.Client(timeout=30.0) as client:
                resp = client.post(
                    f"{self._mem0_url.rstrip('/')}/embed",
                    json={"text": data},
                )
                resp.raise_for_status()
                return resp.json()["vector"]
        except Exception as e:
            logger.error(f"[vanna] Embedding failed via Mem0: {e}")
            raise


# ---------------------------------------------------------------------------
# Lazy singleton — only initialized on first call, NOT at import time
# ---------------------------------------------------------------------------
_vn_instance = None


def get_vanna():
    """Lazy-init Vanna. Returns None if dependencies not ready."""
    global _vn_instance
    if _vn_instance is not None:
        return _vn_instance

    settings = get_settings()
    try:
        api_key = settings.openai_api_key or settings.openrouter_api_key
        if not api_key:
            logger.warning("No OpenAI/OpenRouter API key found. Vanna will not be initialized.")
            return None

        qdrant_client = QdrantClient(url=settings.qdrant_http_url)
        mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")

        _vn_instance = CustomVanna(config={
            'client': qdrant_client,
            'api_key': api_key,
            'base_url': settings.openai_base_url,
            'model': settings.llm_model,
            'mem0_url': mem0_url,
            # Vanna collection — now 1024 dim (same as everything else)
            'collection_name': 'vanna_schemas_openai',
        })

        if not settings.database_url:
            logger.error("DATABASE_URL is missing.")
            return None

        url = make_url(settings.database_url)
        _vn_instance.connect_to_postgres(
            host=url.host,
            dbname=url.database,
            user=url.username,
            password=url.password,
            port=url.port or 5432,
        )

        logger.info(
            "Vanna initialized: embedding=Vietnamese_Embedding_v2 (%d dim) via Mem0, "
            "collection=vanna_schemas_openai",
            VANNA_EMBEDDING_DIM,
        )
        return _vn_instance

    except Exception as e:
        logger.error(f"Failed to initialize Vanna: {e}")
        return None
