"""One-shot script: drop & recreate Qdrant collections with new vector_size.

Usage (after rebuilding containers):
    docker compose --env-file .env exec backend python -m scripts.recreate_qdrant_collections
"""
from src.core.config import get_settings
from src.core.qdrant_setup import get_qdrant_client, ensure_collections

settings = get_settings()
client = get_qdrant_client()

for name in ("chat_chunks", "port_knowledge", "vanna_schemas_openai", "mem0_memories"):
    try:
        client.delete_collection(name)
        print(f"[OK] Deleted {name}")
    except Exception as e:
        print(f"[SKIP] {name}: {e}")

ensure_collections(client, settings.embedding_dimension)
print(f"[OK] Recreated all collections with vector_size={settings.embedding_dimension}")
