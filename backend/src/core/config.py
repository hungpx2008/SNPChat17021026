from functools import lru_cache
from typing import List, Any

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = Field(..., alias="DATABASE_URL")
    redis_url: str = Field("redis://localhost:6379/0", alias="REDIS_URL")
    qdrant_http_url: str = Field("http://localhost:6333", alias="QDRANT_URL")
    qdrant_grpc_url: str | None = Field(None, alias="QDRANT_GRPC_URL")
    mem0_url: str = Field("http://mem0:8000", alias="MEM0_URL")
    embedding_dimension: int = Field(1024, alias="EMBEDDING_DIMENSION")
    embedding_model: str = Field("thanhtantran/Vietnamese_Embedding_v2", alias="EMBEDDING_MODEL")
    embedding_device: str = Field("cpu", alias="EMBEDDING_DEVICE")
    chat_max_sessions: int = Field(100, alias="CHAT_MAX_SESSIONS")
    chat_cache_window: int = Field(20, alias="CHAT_CACHE_WINDOW")
    chat_cache_window: int = Field(20, alias="CHAT_CACHE_WINDOW")
    chat_chunk_size: int = Field(512, alias="CHAT_CHUNK_SIZE")
    
    # LLM Keys
    openai_api_key: str | None = Field(None, alias="OPENAI_API_KEY")
    openai_base_url: str = Field("https://openrouter.ai/api/v1", alias="OPENAI_BASE_URL")
    openrouter_api_key: str | None = Field(None, alias="OPENROUTER_API_KEY")
    llm_model: str = Field("gpt-4o-mini", alias="LLM_MODEL")

    allowed_origins: Any = Field(default_factory=lambda: ["*"], alias="CORS_ALLOW_ORIGINS")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="allow")

    @field_validator("database_url")
    @classmethod
    def ensure_asyncpg(cls, value: str) -> str:
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+asyncpg://", 1)
        return value

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def split_origins(cls, value: Any) -> List[str]:
        if isinstance(value, str):
            value = value.strip()
            # Handle JSON list string case: ["a", "b"]
            if value.startswith("[") and value.endswith("]"):
                try:
                    import json
                    return json.loads(value)
                except Exception:
                    pass
            # Handle comma-separated string case: a, b
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache()
def get_settings() -> Settings:
    return Settings()
