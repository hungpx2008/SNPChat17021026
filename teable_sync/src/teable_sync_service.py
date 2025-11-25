"""
Teable synchronization service.

The module coordinates data consistency between Teable (PostgreSQL-backed),
Qdrant, and Redis. It can react to webhooks or poll the Teable API and
propagate changes to the downstream systems used by the chatbot.
"""

from __future__ import annotations

import asyncio
import os
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional

import httpx
from sqlalchemy import text

from .db.postgres import get_session
from .db.qdrant import delete_vectors, upsert_vectors
from .db.redis import get_redis_client
from .utils.logger import get_logger

logger = get_logger(__name__)


@dataclass(slots=True)
class Settings:
    teable_api_url: str
    teable_api_key: str
    qdrant_collection: str = "knowledge_base"
    redis_cache_prefix: str = "teable:kb"

    @classmethod
    def from_env(cls) -> "Settings":
        api_url = os.getenv("TEABLE_API_URL")
        api_key = os.getenv("TEABLE_API_KEY")
        if not api_url or not api_key:
            raise RuntimeError("TEABLE_API_URL and TEABLE_API_KEY must be set")
        return cls(
            teable_api_url=api_url.rstrip("/"),
            teable_api_key=api_key,
            qdrant_collection=os.getenv("QDRANT_COLLECTION", "knowledge_base"),
            redis_cache_prefix=os.getenv("REDIS_CACHE_PREFIX", "teable:kb"),
        )


def embed_text(text_value: str) -> List[float]:
    """
    Placeholder embedding generator.

    Replace this with a production-grade embedding model (OpenAI, Hugging Face, etc.).
    The deterministic hash keeps item order stable for demonstration purposes.
    """
    # Simple fixed-dimension pseudo embedding based on hashing words.
    vector = [0.0] * 16
    if not text_value:
        return vector
    for index, token in enumerate(text_value.split()):
        bucket = index % len(vector)
        vector[bucket] += float(hash(token) % 1024) / 1024.0
    return vector


class TeableSyncService:
    """
    Responsible for consuming Teable events and syncing downstream stores.
    """

    def __init__(self, settings: Optional[Settings] = None):
        self.settings = settings or Settings.from_env()
        self._http_client = httpx.AsyncClient(
            base_url=self.settings.teable_api_url,
            headers={
                "Authorization": f"Bearer {self.settings.teable_api_key}",
                "Content-Type": "application/json",
            },
            timeout=10.0,
        )
        self._redis = get_redis_client()

    async def close(self) -> None:
        await self._http_client.aclose()

    async def poll_changes(self, table_name: str, interval_seconds: int = 10) -> None:
        """
        Simple polling loop that periodically pulls table data and refreshes caches.

        In production you should prefer Teable webhooks if available.
        """
        logger.info("Starting poller for table '%s' (interval=%ss)", table_name, interval_seconds)
        try:
            while True:
                await self.sync_from_teable(table_name)
                await asyncio.sleep(interval_seconds)
        except asyncio.CancelledError:
            logger.info("Polling for table '%s' cancelled", table_name)
            raise
        except Exception:
            logger.exception("Unexpected error in polling loop")
        finally:
            await self.close()

    async def handle_webhook_event(self, event_payload: Dict[str, Any]) -> None:
        """
        Process a webhook notification from Teable.

        Expected payload structure (example):
            {
                "table": "knowledge_base",
                "action": "updated",  # created|deleted|updated
                "record_id": "rec123",
            }
        """
        table = event_payload.get("table")
        action = event_payload.get("action")
        record_id = event_payload.get("record_id")
        if not table or not action or not record_id:
            logger.warning("Webhook payload missing required fields: %s", event_payload)
            return

        logger.info("Processing %s event for %s/%s", action, table, record_id)
        if action == "deleted":
            await self._handle_delete(table, record_id)
            return

        record = await self.fetch_record(table, record_id)
        if not record:
            logger.warning("Record %s/%s not found in Teable API", table, record_id)
            return
        await self._sync_record(table, record)

    async def fetch_table(self, table_name: str) -> List[Dict[str, Any]]:
        """
        Pull all rows for a table via Teable API.
        """
        response = await self._http_client.get(f"/tables/{table_name}/records")
        response.raise_for_status()
        data = response.json()
        records = data.get("records", data)
        logger.debug("Fetched %d records from Teable table '%s'", len(records), table_name)
        return records

    async def fetch_record(self, table_name: str, record_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetch a single record from Teable.
        """
        response = await self._http_client.get(f"/tables/{table_name}/records/{record_id}")
        if response.status_code == 404:
            return None
        response.raise_for_status()
        return response.json()

    async def _sync_record(self, table_name: str, record: Dict[str, Any]) -> None:
        """
        Synchronize a single record to Qdrant and Redis.
        """
        record_id = record.get("id") or record.get("record_id")
        # Teable uses `fields` to hold column data, mimic Airtable style.
        fields = record.get("fields", record)
        content_field = fields.get("content") or fields.get("text") or ""
        logger.debug("Syncing record %s with fields keys=%s", record_id, list(fields.keys()))

        # 1. Refresh Redis cache for the record.
        cache_key = f"{self.settings.redis_cache_prefix}:{table_name}:{record_id}"
        await self._redis.set(cache_key, str(fields))

        # 2. Recompute embeddings and upsert into Qdrant.
        embedding = embed_text(content_field)
        payload = {
            "record_id": record_id,
            "table": table_name,
            "fields": fields,
        }
        upsert_vectors(
            collection_name=self.settings.qdrant_collection,
            vectors=[embedding],
            payloads=[payload],
            ids=[str(record_id)],
        )

        logger.info("Record %s synced to Redis and Qdrant", record_id)

    async def _handle_delete(self, table_name: str, record_id: str) -> None:
        """
        Remove record artifacts from Redis and Qdrant.
        """
        cache_key = f"{self.settings.redis_cache_prefix}:{table_name}:{record_id}"
        await self._redis.delete(cache_key)
        delete_vectors(self.settings.qdrant_collection, [str(record_id)])
        logger.info("Deleted record %s from Redis and Qdrant", record_id)

    async def sync_from_teable(self, table_name: str) -> None:
        """
        Manual sync entrypoint; fetches all records from Teable and refreshes downstream stores.
        """
        logger.info("Manual sync started for table '%s'", table_name)
        records = await self.fetch_table(table_name)
        for record in records:
            await self._sync_record(table_name, record)
        logger.info("Manual sync complete for table '%s' (%d records)", table_name, len(records))

    async def refresh_postgres_materialized_view(self, view_name: str) -> None:
        """
        Optional helper: refresh a materialized view inside Teable Postgres.
        """
        async with get_session() as session:
            await session.execute(text(f"REFRESH MATERIALIZED VIEW CONCURRENTLY {view_name}"))
            await session.commit()
        logger.info("Materialized view %s refreshed", view_name)


# Public utility so other modules may import directly.
async def sync_from_teable(table_name: str) -> None:
    """
    Convenience wrapper used for CLI/manual jobs.
    """
    service = TeableSyncService()
    try:
        await service.sync_from_teable(table_name)
    finally:
        await service.close()


async def _demo() -> None:
    """
    Example usage syncing the 'knowledge_base' table once, then exiting.
    """
    table = os.getenv("TEABLE_DEMO_TABLE", "knowledge_base")
    await sync_from_teable(table)


if __name__ == "__main__":
    asyncio.run(_demo())
