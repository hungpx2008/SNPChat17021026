import asyncio
import pytest
import pytest_asyncio
from dotenv import load_dotenv
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncEngine
from unittest.mock import MagicMock, patch

from app.config import get_settings
from app.db import Base, get_engine
from app.main import create_app
from app.qdrant_client import ensure_collections, get_qdrant_client
from app.redis_client import get_redis


load_dotenv(".env.databases")
load_dotenv()


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def app() -> FastAPI:
    # Mock embedding model to prevent download during tests
    with patch("app.embeddings.get_embedding_model") as mock_get_model:
        mock_model = MagicMock()
        # Mock encode to return a vector of size EMBEDDING_DIMENSION (1024)
        mock_model.encode.return_value = [0.1] * 1024
        mock_get_model.return_value = mock_model
        
        application = create_app()
        return application


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_databases() -> None:
    settings = get_settings()
    engine: AsyncEngine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    redis = get_redis()
    await redis.flushdb()

    qdrant = get_qdrant_client()
    ensure_collections(qdrant, settings.embedding_dimension)
    for collection in ("chat_chunks", "long_term_memory"):
        try:
            qdrant.delete_collection(collection)
        except Exception:
            pass
    ensure_collections(qdrant, settings.embedding_dimension)
    yield


@pytest_asyncio.fixture()
async def client(app: FastAPI):
    async with AsyncClient(app=app, base_url="http://testserver") as async_client:
        yield async_client


@pytest_asyncio.fixture(autouse=True)
async def cleanup_between_tests():
    yield
    engine: AsyncEngine = get_engine()
    async with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            await conn.execute(table.delete())
    redis = get_redis()
    await redis.flushdb()
    qdrant = get_qdrant_client()
    for collection in ("chat_chunks", "long_term_memory"):
        try:
            qdrant.delete_collection(collection)
        except Exception:
            pass
    ensure_collections(qdrant, get_settings().embedding_dimension)
