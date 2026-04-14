"""Semantic cache for hybrid search results.

Caches search results in Redis keyed by a normalized query hash.
TTL is configurable (default 30 minutes).

Cache key format: "scache:{user_scope}:{query_hash}"
- user_scope = user_id or "global"
- query_hash = sha256 of normalized query

Normalization: lowercase, strip, collapse whitespace, remove Vietnamese diacritics for matching.
"""

from __future__ import annotations

import hashlib
import json
import logging
import os
import re
import unicodedata
from typing import Any

from src.core.redis_client import get_redis

logger = logging.getLogger(__name__)

CACHE_TTL_SECONDS = int(os.getenv("SEARCH_CACHE_TTL", "1800"))  # 30 min default
CACHE_KEY_PREFIX = "scache"


class SemanticCache:
    """Redis-backed cache for hybrid search results."""

    def __init__(self, ttl: int = CACHE_TTL_SECONDS):
        self._ttl = ttl
        self._redis = get_redis()

    async def get(self, query: str, user_id: str | None = None) -> list[dict] | None:
        """Look up cached search results. Returns None on miss."""
        key = self._make_key(query, user_id)
        try:
            raw = await self._redis.get(key)
            if raw is None:
                logger.debug("[SemanticCache] MISS: %s", key)
                return None
            logger.debug("[SemanticCache] HIT: %s", key)
            return json.loads(raw)
        except Exception:
            logger.warning("[SemanticCache] Redis GET error for key=%s", key, exc_info=True)
            return None

    async def put(
        self, query: str, results: list[dict], user_id: str | None = None
    ) -> None:
        """Store search results in cache."""
        key = self._make_key(query, user_id)
        try:
            payload = json.dumps(results, ensure_ascii=False, default=str)
            await self._redis.set(key, payload, ex=self._ttl)
            logger.debug("[SemanticCache] PUT: %s (%d results, ttl=%ds)", key, len(results), self._ttl)
        except Exception:
            logger.warning("[SemanticCache] Redis SET error for key=%s", key, exc_info=True)

    async def invalidate(self, user_id: str | None = None) -> int:
        """Clear cache entries for a user (or all if user_id is None).

        Uses SCAN to find matching keys (never KEYS in production).

        Returns
        -------
        int
            Number of keys deleted.
        """
        if user_id is not None:
            pattern = f"{CACHE_KEY_PREFIX}:{user_id}:*"
        else:
            pattern = f"{CACHE_KEY_PREFIX}:*"

        deleted = 0
        try:
            cursor = "0"
            while True:
                cursor, keys = await self._redis.scan(
                    cursor=cursor, match=pattern, count=100
                )
                if keys:
                    deleted += await self._redis.delete(*keys)
                if cursor == 0 or cursor == "0":
                    break
            logger.info("[SemanticCache] INVALIDATE pattern=%s deleted=%d", pattern, deleted)
        except Exception:
            logger.warning(
                "[SemanticCache] Redis SCAN/DELETE error for pattern=%s",
                pattern,
                exc_info=True,
            )
        return deleted

    @staticmethod
    def _normalize(query: str) -> str:
        """Normalize query for cache key generation.

        Steps:
        1. Strip leading/trailing whitespace
        2. Lowercase
        3. Remove Vietnamese diacritics via NFD decomposition
           (strip combining characters, keep base letters)
        4. Collapse multiple whitespace to single space
        """
        text = query.strip().lower()
        # NFD decomposition: split base characters from combining marks
        nfd = unicodedata.normalize("NFD", text)
        # Remove combining characters (diacritics)
        stripped = "".join(ch for ch in nfd if unicodedata.category(ch) != "Mn")
        # Collapse whitespace
        collapsed = re.sub(r"\s+", " ", stripped).strip()
        return collapsed

    @staticmethod
    def _make_key(query: str, user_id: str | None) -> str:
        """Generate Redis cache key from normalized query."""
        normalized = SemanticCache._normalize(query)
        query_hash = hashlib.sha256(normalized.encode("utf-8")).hexdigest()
        scope = user_id if user_id else "global"
        return f"{CACHE_KEY_PREFIX}:{scope}:{query_hash}"
