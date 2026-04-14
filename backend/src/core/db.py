from collections.abc import AsyncGenerator
import logging

from sqlalchemy import MetaData, text
from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base

from src.core.config import get_settings


logger = logging.getLogger(__name__)


NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


metadata = MetaData(naming_convention=NAMING_CONVENTION)
Base = declarative_base(metadata=metadata)

_engine: AsyncEngine | None = None
SessionLocal: async_sessionmaker[AsyncSession] | None = None


def init_engine() -> None:
    global _engine, SessionLocal  # noqa: PLW0603
    settings = get_settings()
    _engine = create_async_engine(settings.database_url, echo=False, future=True)
    SessionLocal = async_sessionmaker(bind=_engine, expire_on_commit=False)


def get_engine() -> AsyncEngine:
    if _engine is None:
        init_engine()
    assert _engine is not None  # for mypy
    return _engine


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    if SessionLocal is None:
        init_engine()
    assert SessionLocal is not None  # for mypy
    async with SessionLocal() as session:
        yield session


async def create_tables() -> None:
    """Create all tables if they don't exist (safe for production — uses IF NOT EXISTS)."""
    if _engine is None:
        init_engine()
    assert _engine is not None
    async with _engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        if conn.dialect.name == "postgresql":
            await _ensure_metadata_columns(conn)
            await _ensure_branching_columns(conn)
        else:
            logger.info("Skipping metadata column backfill for dialect: %s", conn.dialect.name)


async def _ensure_metadata_columns(conn: AsyncConnection) -> None:
    """Add missing JSON metadata columns to legacy tables for backward compatibility."""
    tables = ("chat_sessions", "chat_messages", "chat_message_chunks", "documents")
    for table in tables:
        await conn.execute(
            text(f"ALTER TABLE IF EXISTS {table} "
                 f"ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{{}}'::jsonb")
        )
        await conn.execute(
            text(f"ALTER TABLE IF EXISTS {table} "
                 f"ALTER COLUMN metadata SET DEFAULT '{{}}'::jsonb")
        )
        await conn.execute(
            text(f"UPDATE {table} SET metadata = '{{}}'::jsonb "
                 f"WHERE metadata IS NULL")
        )


async def _ensure_branching_columns(conn: AsyncConnection) -> None:
    """Add conversation branching columns to chat_messages for edit/regenerate support."""
    # Add columns
    await conn.execute(text(
        "ALTER TABLE IF EXISTS chat_messages "
        "ADD COLUMN IF NOT EXISTS parent_message_id UUID "
        "REFERENCES chat_messages(id) ON DELETE SET NULL"
    ))
    await conn.execute(text(
        "ALTER TABLE IF EXISTS chat_messages "
        "ADD COLUMN IF NOT EXISTS branch_index INTEGER NOT NULL DEFAULT 0"
    ))
    await conn.execute(text(
        "ALTER TABLE IF EXISTS chat_messages "
        "ADD COLUMN IF NOT EXISTS is_active_branch BOOLEAN NOT NULL DEFAULT TRUE"
    ))

    # Create index
    await conn.execute(text(
        "CREATE INDEX IF NOT EXISTS ix_chat_messages_parent "
        "ON chat_messages (parent_message_id)"
    ))

    # Backfill parent_message_id for existing rows using LAG window function
    await conn.execute(text("""
        UPDATE chat_messages AS cm
        SET parent_message_id = sub.prev_id
        FROM (
            SELECT id,
                   LAG(id) OVER (PARTITION BY session_id ORDER BY created_at) AS prev_id
            FROM chat_messages
        ) AS sub
        WHERE cm.id = sub.id
          AND cm.parent_message_id IS NULL
          AND sub.prev_id IS NOT NULL
    """))
