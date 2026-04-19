from datetime import datetime
from typing import Any, Literal, Optional
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


class MessageCreate(BaseModel):
    role: str
    content: str
    metadata: dict[str, Any] | None = None
    mode: Literal["chat", "sql", "rag"] = "chat"
    parent_message_id: UUID | None = None


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
    parent_message_id: UUID | None = None
    branch_index: int = 0
    is_active_branch: bool = True
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
    has_more: bool = False
    oldest_id: UUID | None = None


class EditMessageRequest(BaseModel):
    content: str


class NavigateBranchRequest(BaseModel):
    direction: Literal[-1, 1]


class BranchInfoSchema(BaseModel):
    current_index: int
    total_branches: int
    sibling_ids: list[UUID] = Field(default_factory=list)
    fork_point_id: UUID | None = None


class BranchMessageSchema(BaseModel):
    """Schema for messages in a branch navigation response."""
    message: MessageSchema
    branch_info: BranchInfoSchema

    model_config = ConfigDict(from_attributes=True)


class TreeNodeSchema(BaseModel):
    """Schema for a node in the conversation tree."""
    id: str
    role: str
    content: str
    created_at: datetime
    branch_index: int
    is_active_branch: bool
    children: list['TreeNodeSchema'] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class ConversationTreeSchema(BaseModel):
    """Schema for the full conversation tree."""
    roots: list[TreeNodeSchema] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


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

class Attachment(BaseModel):
    """Media attachment in Omni-channel response."""
    type: str  # "chart" | "audio" | "document"
    url: str
    filename: Optional[str] = None

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
