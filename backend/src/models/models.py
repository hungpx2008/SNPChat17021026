from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Index

from src.core.db import Base


class ChatSession(Base):
    __tablename__ = "chat_sessions"
    __table_args__ = (
        Index("ix_chat_sessions_user_updated", "user_id", "updated_at"),
    )

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    external_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)
    user_id: Mapped[Optional[str]] = mapped_column(String(255), index=True, nullable=True)
    department: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    meta: Mapped[dict] = mapped_column("metadata", JSON, default=dict)  # {"summary": "...", "message_count_at_summary": N}
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )

    messages: Mapped[list["ChatMessage"]] = relationship(
        "ChatMessage", back_populates="session", cascade="all, delete-orphan"
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    __table_args__ = (
        Index("ix_chat_messages_session_created", "session_id", "created_at"),
        Index("ix_chat_messages_parent", "parent_message_id"),
    )

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    session_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("chat_sessions.id", ondelete="CASCADE"), index=True
    )
    role: Mapped[str] = mapped_column(String(32))
    content: Mapped[str] = mapped_column(Text())
    meta: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    parent_message_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("chat_messages.id", ondelete="SET NULL"),
        nullable=True,
    )
    branch_index: Mapped[int] = mapped_column(default=0)
    is_active_branch: Mapped[bool] = mapped_column(default=True)

    session: Mapped[ChatSession] = relationship("ChatSession", back_populates="messages")
    parent_message: Mapped["ChatMessage | None"] = relationship(
        "ChatMessage",
        remote_side=[id],
        foreign_keys=[parent_message_id],
        lazy="select",
    )
    chunks: Mapped[list["ChatMessageChunk"]] = relationship(
        "ChatMessageChunk", back_populates="message", cascade="all, delete-orphan"
    )


class ChatMessageChunk(Base):
    __tablename__ = "chat_message_chunks"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    message_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("chat_messages.id", ondelete="CASCADE"), index=True
    )
    chunk_index: Mapped[int] = mapped_column()
    content: Mapped[str] = mapped_column(Text())
    vector_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    meta: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    message: Mapped[ChatMessage] = relationship("ChatMessage", back_populates="chunks")


class Document(Base):
    """Tracks uploaded documents and their processing status."""
    __tablename__ = "documents"
    __table_args__ = (
        Index("ix_documents_user_filename", "user_id", "filename"),
    )

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[Optional[str]] = mapped_column(String(255), index=True, nullable=True)
    filename: Mapped[str] = mapped_column(String(512))
    file_path: Mapped[str] = mapped_column(String(1024))
    status: Mapped[str] = mapped_column(String(32), default="processing")  # processing | ready | error
    chunk_count: Mapped[int] = mapped_column(default=0)
    extractor_used: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)  # docling | vlm | whisper_local
    error_message: Mapped[Optional[str]] = mapped_column(Text(), nullable=True)
    meta: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )


class MessageFeedback(Base):
    """User feedback on bot messages for self-correction."""
    __tablename__ = "message_feedbacks"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    message_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("chat_messages.id", ondelete="CASCADE"), index=True
    )
    is_liked: Mapped[bool] = mapped_column()
    reason: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class ChunkParent(Base):
    """Parent chunks for 2-tier parent-child retrieval.

    Stores the full-context parent text in PostgreSQL.
    Child chunks (smaller, search-optimized) are stored in Qdrant
    with a parent_id payload field pointing back here.
    """
    __tablename__ = "chunk_parents"
    __table_args__ = (
        Index("ix_chunk_parents_document_id", "document_id"),
    )

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    document_id: Mapped[Optional[UUID]] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=True,
    )
    content: Mapped[str] = mapped_column(Text(), nullable=False)
    page_number: Mapped[int] = mapped_column(default=0, insert_default=0)
    headings: Mapped[dict] = mapped_column("headings", JSON, default=list, insert_default=list)
    meta: Mapped[dict] = mapped_column("metadata", JSON, default=dict, insert_default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
