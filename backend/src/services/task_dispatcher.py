"""Typed helpers for dispatching Celery background tasks.

Centralizes the ``.delay(...)`` calls that were previously scattered across
api/chat.py and services/chat_service.py, eliminating repeated unpacking
of session_id / message_id / content / role / user_id / department.
"""
from __future__ import annotations

import logging
from uuid import UUID

logger = logging.getLogger(__name__)


def dispatch_chat_embed(
    *,
    session_id: str | UUID,
    message_id: str | UUID,
    content: str,
    role: str,
    user_id: str | None = None,
    department: str | None = None,
) -> None:
    """Enqueue chunk+embed for a chat message."""
    from src.worker.tasks import process_chat_response

    process_chat_response.delay(
        session_id=str(session_id),
        message_id=str(message_id),
        content=content,
        role=role,
        user_id=user_id,
        department=department,
    )


def dispatch_rag_search(
    *,
    question: str,
    session_id: str | UUID,
    user_id: str | None = None,
    department: str | None = None,
    target_message_id: str | UUID | None = None,
    source_message_id: str | UUID | None = None,
) -> None:
    """Enqueue RAG document search for a user question."""
    from src.worker.tasks import rag_document_search

    kwargs: dict = {
        "question": question,
        "session_id": str(session_id),
        "user_id": user_id,
        "department": department,
    }
    if target_message_id is not None:
        kwargs["target_message_id"] = str(target_message_id)
    if source_message_id is not None:
        kwargs["source_message_id"] = str(source_message_id)
    rag_document_search.delay(**kwargs)


def dispatch_sql_query(
    *,
    question: str,
    session_id: str | UUID,
    user_id: str | None = None,
    department: str | None = None,
    target_message_id: str | UUID | None = None,
) -> None:
    """Enqueue SQL query generation via Vanna."""
    from src.worker.tasks import run_sql_query

    kwargs: dict = {
        "question": question,
        "session_id": str(session_id),
        "user_id": user_id,
    }
    if department is not None:
        kwargs["department"] = department
    if target_message_id is not None:
        kwargs["target_message_id"] = str(target_message_id)
    run_sql_query.delay(**kwargs)


def dispatch_summary_check(
    *,
    session_id: str | UUID,
    keep_count: int | None = None,
    trim_tokens: int | None = None,
) -> None:
    """Enqueue session history summarization check."""
    from src.worker.tasks import summarize_session_history

    kwargs: dict = {"session_id": str(session_id)}
    if keep_count is not None:
        kwargs["keep_count"] = keep_count
    if trim_tokens is not None:
        kwargs["trim_tokens"] = trim_tokens
    summarize_session_history.delay(**kwargs)


def dispatch_store_memory(
    *,
    session_id: str | UUID,
    content: str,
    user_id: str,
    role: str = "user",
    department: str | None = None,
) -> None:
    """Enqueue long-term memory storage via Mem0."""
    from src.worker.tasks import store_memory

    store_memory.delay(
        session_id=str(session_id),
        content=content,
        user_id=user_id,
        role=role,
        department=department,
    )
