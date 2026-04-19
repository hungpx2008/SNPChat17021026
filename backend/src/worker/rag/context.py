"""Context-gathering helpers for RAG pipeline.

Functions here collect long-term memory, session history, and build
the unified context dict consumed by the synthesis step.
"""
from __future__ import annotations

import logging
import os
from typing import Any

import sqlalchemy.exc

from src.core.constants import MEM0_SEARCH_LIMIT, RAG_SEARCH_LIMIT

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Leaf helpers (no cross-module deps)
# ---------------------------------------------------------------------------


def _fetch_mem0_memories(question: str, user_id: str) -> list[str]:
    """Fetch long-term memories from Mem0 (local, no HTTP).

    Parameters
    ----------
    question : str
        Search query used to find relevant memories.
    user_id : str
        Owner of the memories to retrieve.

    Returns
    -------
    list[str]
        Memory text snippets.  Returns an empty list on any failure.
    """
    try:
        from src.core.mem0_local import search_memories

        result = search_memories(query=question, user_id=user_id, limit=MEM0_SEARCH_LIMIT)
        results = result.get("results") or result if isinstance(result, list) else []
        if isinstance(result, dict):
            results = result.get("results", [])
        return [
            item.get("text") or item.get("memory") or ""
            for item in results
            if item.get("text") or item.get("memory")
        ]
    except Exception as e:  # Justified: Mem0 local lib may raise unpredictable errors
        logger.warning("[RAG] Mem0 long-term fetch failed (%s): %s", type(e).__name__, e)
        return []


def _fetch_session_history(session_id: str) -> tuple[str, list[dict]]:
    """Fetch session summary and all messages from DB.

    Returns (summary_text, all_messages) where messages are in chronological order.

    Parameters
    ----------
    session_id : str
        Chat session identifier.

    Returns
    -------
    tuple[str, list[dict]]
        ``(summary_text, all_messages)`` — summary may be ``""`` if the
        session has not been summarised yet.

    Raises
    ------
    sqlalchemy.exc.SQLAlchemyError
        On database connection or query failures.
    """
    from src.core.database_pool import db_pool

    # Fetch session summary
    summary_text = ""
    meta_rows = db_pool.execute_query_fetchall(
        "SELECT metadata FROM chat_sessions WHERE id = :sid",
        {"sid": session_id},
    )
    if meta_rows and meta_rows[0][0]:
        meta = meta_rows[0][0]
        if isinstance(meta, dict) and meta.get("summary"):
            summary_text = str(meta["summary"])

    # Fetch ALL messages (ContextBuilder handles budget fitting)
    msg_rows = db_pool.execute_query_fetchall(
        "SELECT role, content FROM chat_messages "
        "WHERE session_id = :sid ORDER BY created_at ASC",
        {"sid": session_id},
    )
    all_messages = [
        {"role": r[0], "content": r[1]}
        for r in msg_rows
        if r[0] is not None
    ]
    return summary_text, all_messages


# ---------------------------------------------------------------------------
# Context builders
# ---------------------------------------------------------------------------


def _build_context_with_builder(
    memories: list[str],
    summary_text: str,
    all_messages: list[dict],
    department: str | None = None,
) -> dict[str, str]:
    """Use ContextBuilder + SystemPromptBuilder for dynamic budget allocation.

    Parameters
    ----------
    memories : list[str]
        Long-term memory snippets from Mem0.
    summary_text : str
        Session summary text (may be empty).
    all_messages : list[dict]
        Full message history ``[{"role": …, "content": …}, …]``.
    department : str or None
        User's department for prompt personalisation.

    Returns
    -------
    dict[str, str]
        Keys: ``long_term_block``, ``summary_block``, ``recent_block``,
        ``system_prompt``.
    """
    from src.services.context_builder import ContextBuilder, SystemPromptBuilder

    llm_model = os.getenv("LLM_MODEL", "claude-opus-4-6")
    prompt_builder = SystemPromptBuilder()
    system_prompt = prompt_builder.build(
        mode="rag",
        memories=memories,
        session_summary=summary_text,
        department=department,
    )
    builder = ContextBuilder(model=llm_model)
    ctx = builder.build_context(
        system_prompt=system_prompt,
        memories=memories,
        summary=summary_text,
        messages=all_messages,
        rag_context="",  # RAG context is added separately in _synthesize_with_llm
    )
    return {
        "long_term_block": ctx.long_term_block,
        "summary_block": ctx.summary_block,
        "recent_block": ctx.recent_block,
        "system_prompt": system_prompt,
    }


def _build_context_fallback(
    memories: list[str],
    summary_text: str,
    all_messages: list[dict],
) -> dict[str, str]:
    """Fallback: return raw data without budget optimization (legacy LIMIT 6 behavior).

    Parameters
    ----------
    memories : list[str]
        Long-term memory snippets.
    summary_text : str
        Session summary.
    all_messages : list[dict]
        Full message history.

    Returns
    -------
    dict[str, str]
        Keys: ``long_term_block``, ``summary_block``, ``recent_block``.
        Does **not** include ``system_prompt`` — the caller must add it.
    """
    long_term_block = "\n".join(f"- {m}" for m in memories) if memories else ""
    recent_block = ""
    if all_messages:
        recent = all_messages[-6:]
        recent_block = "\n".join(f"{m['role'].upper()}: {m['content']}" for m in recent)
    return {
        "long_term_block": long_term_block,
        "summary_block": summary_text,
        "recent_block": recent_block,
    }


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------


def _gather_unified_context(
    question: str,
    session_id: str,
    user_id: str | None,
    department: str | None = None,
) -> dict[str, str]:
    """Collect long-term memory, session summary, and recent chat for unified prompting.

    Uses ContextBuilder + SystemPromptBuilder for dynamic budget-based context
    assembly. Falls back to legacy behavior on import errors.

    Parameters
    ----------
    question : str
        The user's current question (used for Mem0 similarity search).
    session_id : str
        Chat session identifier.
    user_id : str or None
        Current user, or ``None`` for anonymous sessions.
    department : str or None
        User's department for personalised prompts.

    Returns
    -------
    dict[str, str]
        Keys: ``long_term_block``, ``summary_block``, ``recent_block``,
        ``system_prompt``.
    """
    from src.core.constants import RAG_SYSTEM_PROMPT

    memories = _fetch_mem0_memories(question, user_id) if user_id else []

    try:
        summary_text, all_messages = _fetch_session_history(session_id)
    except sqlalchemy.exc.SQLAlchemyError as e:
        logger.warning("[RAG] Recent history DB fetch failed: %s", e)
        summary_text, all_messages = "", []

    try:
        return _build_context_with_builder(memories, summary_text, all_messages, department)
    except (ImportError, TypeError, KeyError) as e:
        logger.warning("[RAG] ContextBuilder failed, using fallback: %s", e)
        result = _build_context_fallback(memories, summary_text, all_messages)
        result["system_prompt"] = RAG_SYSTEM_PROMPT  # fallback uses static prompt
        return result
