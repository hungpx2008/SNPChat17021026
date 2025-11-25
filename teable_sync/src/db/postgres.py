"""
Helpers for connecting to the Teable PostgreSQL instance using SQLAlchemy.

The module exposes:
  - `engine`: shared AsyncEngine configured via POSTGRES_URL.
  - `AsyncSessionLocal`: async session factory for request-scoped sessions.
  - `get_session()`: async context manager yielding a session.
  - `check_postgres_connection()`: rapid health probe used by `/health`.
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import AsyncIterator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

POSTGRES_URL = os.getenv("POSTGRES_URL")
if not POSTGRES_URL:
    raise RuntimeError("POSTGRES_URL environment variable is required")

# Lazily create a global engine. Pool recycling keeps long-lived processes healthy.
engine: AsyncEngine = create_async_engine(
    POSTGRES_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

# Factory for producing AsyncSession objects.
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False,
)


@asynccontextmanager
async def get_session() -> AsyncIterator[AsyncSession]:
    """
    Provide a transactional scope for DB operations.

    Usage:
        async with get_session() as session:
            await session.execute(...)
            await session.commit()
    """
    session = AsyncSessionLocal()
    try:
        yield session
    finally:
        await session.close()


async def check_postgres_connection() -> bool:
    """
    Lightweight health probe. Attempts a trivial `SELECT 1`.

    Returns:
        True when the query succeeds, False otherwise.
    """
    try:
        async with get_session() as session:
            await session.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
