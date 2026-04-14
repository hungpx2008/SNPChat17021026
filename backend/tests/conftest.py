import asyncio
import os
import sys
from contextlib import contextmanager
from types import ModuleType, SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
import pytest_asyncio
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker


ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)


class FakeCeleryApp:
    def __init__(self, name: str):
        self.name = name

    def config_from_object(self, obj: str) -> None:
        self.config = obj

    def autodiscover_tasks(self, packages: list[str]) -> None:
        self.packages = packages

    def task(self, *decorator_args, **decorator_kwargs):
        def decorator(func):
            func.delay = MagicMock()
            return func
        return decorator


fake_celery_module = ModuleType("celery")
fake_celery_module.Celery = FakeCeleryApp
fake_celery_schedules = ModuleType("celery.schedules")
fake_celery_schedules.crontab = lambda *args, **kwargs: ("crontab", args, kwargs)
sys.modules.setdefault("celery", fake_celery_module)
sys.modules.setdefault("celery.schedules", fake_celery_schedules)


def _fake_task():
    def call(*args, **kwargs):
        return None
    call.delay = MagicMock()
    return call


fake_worker_tasks = ModuleType("src.worker.tasks")
fake_worker_tasks.process_chat_response = _fake_task()
fake_worker_tasks.store_memory = _fake_task()
fake_worker_tasks.rag_document_search = _fake_task()
fake_worker_tasks.run_sql_query = _fake_task()
fake_worker_tasks.summarize_session_history = _fake_task()
sys.modules.setdefault("src.worker.tasks", fake_worker_tasks)

load_dotenv(os.path.join(os.path.dirname(ROOT_DIR), ".env.databases"))
load_dotenv(os.path.join(os.path.dirname(ROOT_DIR), ".env"))

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./tests.db")
os.environ.setdefault("REDIS_URL", "redis://unused:6379/0")
os.environ.setdefault("QDRANT_URL", "http://unused:6333")

from src.core.config import get_settings
from src.core.db import Base, get_engine

class FakeRedisPubSub:
    async def subscribe(self, channel: str) -> None:
        self.channel = channel

    async def get_message(self, ignore_subscribe_messages: bool = True, timeout: float = 1.0):
        return None

    async def unsubscribe(self, channel: str) -> None:
        return None

    async def aclose(self) -> None:
        return None


class FakeRedis:
    def __init__(self):
        self.store: dict[str, str] = {}

    async def get(self, key: str):
        return self.store.get(key)

    async def set(self, key: str, value: str, ex: int | None = None):
        self.store[key] = value
        return True

    async def delete(self, key: str):
        self.store.pop(key, None)
        return True

    async def flushdb(self):
        self.store.clear()
        return True

    async def ping(self):
        return True

    def pubsub(self):
        return FakeRedisPubSub()


class FakeQdrantCollections:
    def __init__(self, names: list[str]):
        self.collections = [SimpleNamespace(name=name) for name in names]


class FakeQdrantClient:
    def __init__(self):
        self.collections: set[str] = set()
        self.points_by_collection: dict[str, list] = {}

    def get_collections(self):
        return FakeQdrantCollections(sorted(self.collections))

    def create_collection(self, collection_name: str, vectors_config=None):
        self.collections.add(collection_name)
        self.points_by_collection.setdefault(collection_name, [])

    def delete_collection(self, collection_name: str):
        self.collections.discard(collection_name)
        self.points_by_collection.pop(collection_name, None)

    def create_payload_index(self, collection_name: str, field_name: str, field_schema=None):
        return None

    def upsert(self, collection_name: str, points):
        bucket = self.points_by_collection.setdefault(collection_name, [])
        raw_points = getattr(points, "points", points)
        if hasattr(raw_points, "payloads"):
            for point_id, vector, payload in zip(raw_points.ids or [], raw_points.vectors, raw_points.payloads):
                bucket.append(SimpleNamespace(id=point_id, vector=vector, payload=payload, score=1.0))
            return

        for point in raw_points:
            bucket.append(
                SimpleNamespace(
                    id=str(getattr(point, "id", "")),
                    vector=getattr(point, "vector", []),
                    payload=getattr(point, "payload", {}),
                    score=1.0,
                )
            )

    def query_points(self, collection_name: str, query, limit: int = 5, query_filter=None):
        bucket = list(self.points_by_collection.get(collection_name, []))

        def matches(point) -> bool:
            if not query_filter:
                return True
            if isinstance(query_filter, dict):
                return all(point.payload.get(key) == value for key, value in query_filter.items())
            for condition in getattr(query_filter, "must", []) or []:
                key = getattr(condition, "key", "")
                value = getattr(getattr(condition, "match", None), "value", None)
                if point.payload.get(key) != value:
                    return False
            return True

        filtered = [point for point in bucket if matches(point)]
        return SimpleNamespace(points=filtered[:limit])


fake_redis = FakeRedis()
fake_qdrant = FakeQdrantClient()


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@contextmanager
def patched_services():
    get_settings.cache_clear()
    with patch("src.core.redis_client.get_redis", return_value=fake_redis), \
         patch("src.services.chat_service.get_redis", return_value=fake_redis), \
         patch("src.core.qdrant_setup.get_qdrant_client", return_value=fake_qdrant), \
         patch("src.services.chat_service.embed_text", new=AsyncMock(return_value=[0.1] * 1024)), \
         patch("src.services.chat_service.search_vectors", side_effect=lambda **kwargs: fake_qdrant.query_points(
             kwargs["collection"], kwargs["vector"], kwargs.get("limit", 5), kwargs.get("filters")
         ).points), \
         patch("src.services.chat_service.get_client") as mock_get_client, \
         patch("src.services.chat_service.process_chat_response.delay", MagicMock()), \
         patch("src.services.chat_service.store_memory.delay", MagicMock()), \
         patch("src.worker.tasks.rag_document_search.delay", MagicMock()), \
         patch("src.worker.tasks.run_sql_query.delay", MagicMock()), \
         patch("src.worker.tasks.summarize_session_history.delay", MagicMock()):
        mock_client = MagicMock()
        mock_client.post = AsyncMock(return_value=SimpleNamespace(status_code=200, json=lambda: {"results": []}))
        mock_get_client.return_value = mock_client
        yield


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_databases() -> None:
    engine: AsyncEngine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    await fake_redis.flushdb()
    fake_qdrant.collections.clear()
    fake_qdrant.points_by_collection.clear()
    yield


@pytest_asyncio.fixture()
async def db_session():
    engine: AsyncEngine = get_engine()
    session_factory = async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)
    with patched_services():
        async with session_factory() as session:
            yield session


@pytest_asyncio.fixture(autouse=True)
async def cleanup_between_tests():
    yield
    engine: AsyncEngine = get_engine()
    async with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            await conn.execute(table.delete())
    await fake_redis.flushdb()
    fake_qdrant.collections.clear()
    fake_qdrant.points_by_collection.clear()
