from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = Field(..., alias="DATABASE_URL")
    redis_url: str = Field("redis://localhost:6379/0", alias="REDIS_URL")
    qdrant_http_url: str = Field("http://localhost:6333", alias="QDRANT_URL")
    qdrant_grpc_url: str | None = Field(None, alias="QDRANT_GRPC_URL")
    embedding_dimension: int = Field(8, alias="EMBEDDING_DIMENSION")
    chat_max_sessions: int = Field(100, alias="CHAT_MAX_SESSIONS")
    chat_cache_window: int = Field(20, alias="CHAT_CACHE_WINDOW")
    chat_chunk_size: int = Field(512, alias="CHAT_CHUNK_SIZE")

    allowed_origins: List[str] = Field(default_factory=lambda: ["*"], alias="CORS_ALLOW_ORIGINS")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="allow")

    @field_validator("database_url")
    @classmethod
    def ensure_asyncpg(cls, value: str) -> str:
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+asyncpg://", 1)
        return value


@lru_cache()
def get_settings() -> Settings:
    return Settings()
