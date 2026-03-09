"""
Database Connection Pool for ChatSNP

Singleton pattern to manage database connections efficiently.
Prevents memory leaks from multiple create_engine() calls.
"""
from __future__ import annotations

import os
import logging
from sqlalchemy import create_engine, text, Engine
from sqlalchemy.pool import QueuePool
from typing import Optional, Any, Dict

logger = logging.getLogger(__name__)

class DatabaseConnectionPool:
    """Singleton database connection pool for sync operations in workers."""

    _instance: Optional[DatabaseConnectionPool] = None
    _engine: Optional[Engine] = None

    def __new__(cls) -> DatabaseConnectionPool:
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._setup_engine()
            logger.info("[DB Pool] Created database connection pool")
        return cls._instance

    @classmethod
    def _setup_engine(cls) -> None:
        """Setup SQLAlchemy engine with connection pooling."""
        db_url = os.getenv("DATABASE_URL", "")

        if not db_url:
            logger.error("[DB Pool] DATABASE_URL not found in environment")
            raise ValueError("DATABASE_URL environment variable is required")

        # Convert async URL to sync URL for workers
        sync_db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")

        cls._engine = create_engine(
            sync_db_url,
            poolclass=QueuePool,
            pool_size=5,           # Number of connections to maintain
            max_overflow=10,       # Additional connections when needed
            pool_recycle=3600,     # Recycle connections after 1 hour
            pool_pre_ping=True,    # Validate connections before use
            echo=False,            # Set to True for SQL debugging
        )

        logger.info(f"[DB Pool] Engine configured with pool_size=5, max_overflow=10")

    def get_engine(self) -> Engine:
        """Get the shared database engine."""
        if self._engine is None:
            raise RuntimeError("[DB Pool] Engine not initialized")
        return self._engine

    def execute_query(self, query: str, params: Optional[Dict[str, Any]] = None) -> Any:
        """Execute a query using the pooled connection."""
        try:
            with self._engine.begin() as conn:
                result = conn.execute(text(query), params or {})
                logger.debug(f"[DB Pool] Executed query: {query[:100]}...")
                return result
        except Exception as e:
            logger.error(f"[DB Pool] Query execution failed: {e}")
            raise

    def execute_query_fetchall(self, query: str, params: Optional[Dict[str, Any]] = None) -> list:
        """Execute a query and return all results."""
        result = self.execute_query(query, params)
        return result.fetchall()

    def execute_query_fetchone(self, query: str, params: Optional[Dict[str, Any]] = None) -> Any:
        """Execute a query and return first result."""
        result = self.execute_query(query, params)
        return result.fetchone()

    def close(self) -> None:
        """Close all connections in the pool."""
        if self._engine:
            self._engine.dispose()
            logger.info("[DB Pool] Connection pool disposed")

# Global singleton instance
db_pool = DatabaseConnectionPool()

def get_db_pool() -> DatabaseConnectionPool:
    """Get the global database connection pool."""
    return db_pool