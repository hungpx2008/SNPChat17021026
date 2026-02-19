from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


class MessageCreate(BaseModel):
    role: str
    content: str
    metadata: dict[str, Any] | None = None


class MessageChunkSchema(BaseModel):
    id: UUID
    chunk_index: int
    content: str
    metadata: dict[str, Any] | None = None

    model_config = ConfigDict(from_attributes=True)


class MessageSchema(BaseModel):
    id: UUID
    session_id: UUID
    role: str
    content: str
    metadata: dict[str, Any] | None = None
    created_at: datetime
    chunks: list[MessageChunkSchema] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class SessionCreate(BaseModel):
    user_id: Optional[str] = None
    department: Optional[str] = None
    title: Optional[str] = None
    external_id: Optional[str] = None


class SessionSchema(BaseModel):
    id: UUID
    user_id: Optional[str] = None
    department: Optional[str] = None
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SessionWithMessages(SessionSchema):
    messages: list[MessageSchema] = Field(default_factory=list)


class SearchQuery(BaseModel):
    user_id: Optional[str] = None
    department: Optional[str] = None
    query: str
    limit: int = 5


class SearchResult(BaseModel):
    text: str
    score: float
    source: str
    metadata: dict[str, Any]


class AdminSessionSummary(SessionSchema):
    message_count: int


class RedisCacheEntry(BaseModel):
    key: str
    session_id: str
    ttl_seconds: Optional[int]
    message_count: int
    size_bytes: int


class RedisCacheResponse(BaseModel):
    entries: list[RedisCacheEntry]


class QdrantCollectionSchema(BaseModel):
    name: str
    vectors_count: int
    status: str


class QdrantPointSchema(BaseModel):
    id: str
    payload: dict[str, Any] | None = None


# ---- Document Upload Schemas ----

class DocumentSchema(BaseModel):
    id: UUID
    user_id: Optional[str] = None
    filename: str
    status: str
    chunk_count: int = 0
    extractor_used: Optional[str] = None
    error_message: Optional[str] = None
    meta: dict[str, Any] = Field(default_factory=dict, alias="meta")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class DocumentUploadResponse(BaseModel):
    document_id: UUID
    filename: str
    status: str
    message: str
