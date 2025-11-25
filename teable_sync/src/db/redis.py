"""
Async Redis helper using redis-py (aioredis) client.
"""

from __future__ import annotations

import os
from typing import Optional

import redis.asyncio as aioredis

REDIS_URL = os.getenv("REDIS_URL")
if not REDIS_URL:
    raise RuntimeError("REDIS_URL environment variable is required")

_redis: Optional[aioredis.Redis] = None


def get_redis_client() -> aioredis.Redis:
    """
    Return a singleton Redis client.
    """
    global _redis  # noqa: PLW0603
    if _redis is None:
        _redis = aioredis.from_url(
            REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis


async def check_redis_connection() -> bool:
    """
    Health probe that issues a PING.
    """
    try:
        client = get_redis_client()
        await client.ping()
        return True
    except Exception:
        return False
