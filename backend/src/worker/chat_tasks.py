"""
Chat tasks — Queue: chat_priority

Tasks:
  - process_chat_response: Chunk → Embed → Store in Qdrant
  - store_memory: Save long-term memory to Mem0
  - rag_document_search: RAG search across uploaded documents
  - process_feedback: Self-correction via user feedback
  - summarize_session_history: Async session summarization
"""
from __future__ import annotations

import logging
import os
from concurrent.futures import ThreadPoolExecutor
from typing import Any
from uuid import uuid4

import httpx
import sqlalchemy.exc
from qdrant_client.http import exceptions as qdrant_exc

from src.core.constants import (
    CHAT_CHUNK_OVERLAP,
    CHAT_CHUNK_SIZE,
    CHAT_EMBED_TRUNCATE,
    RAG_FEEDBACK_SIMILARITY,
    SUMMARY_KEEP_COUNT,
    SUMMARY_TRIM_TOKENS,
)

from .celery_app import celery_app
from .rag.context import _gather_unified_context
from .rag.search_helpers import (
    _build_hybrid_context_and_citations,
    _run_hybrid_search,
    _save_rag_error,
    _save_rag_result,
)
from .rag.synthesis import (
    _build_fallback_answer,
    _format_citations_footer,
    _sanitize_generated_answer,
    _synthesize_with_llm,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Module-level singleton for the HuggingFace embedding model used in retrieval.
# Loading ~1.3 GB model once per worker process instead of once per request.
# ---------------------------------------------------------------------------
_hf_embed_model = None
_hf_embed_model_name: str | None = None


def _get_hf_embed_model():
    """Return a cached SentenceTransformer instance (loaded once per Celery worker)."""
    global _hf_embed_model, _hf_embed_model_name  # noqa: PLW0603
    model_name = os.getenv("EMBEDDING_MODEL", "thanhtantran/Vietnamese_Embedding_v2")
    if _hf_embed_model is None or _hf_embed_model_name != model_name:
        from sentence_transformers import SentenceTransformer
        logger.info(f"[RAG] Loading SentenceTransformer embedding model: {model_name}")
        _hf_embed_model = SentenceTransformer(model_name)
        _hf_embed_model_name = model_name
        logger.info("[RAG] Embedding model loaded and cached.")
    return _hf_embed_model


def embed_query(text: str) -> list[float]:
    """Embed a single query string into a vector using the cached model."""
    model = _get_hf_embed_model()
    return model.encode(text, normalize_embeddings=True).tolist()


# =============================================================================
# 🔴 QUEUE: chat_priority — Chat real-time
# =============================================================================

@celery_app.task(name="src.worker.tasks.process_chat_response", bind=True, max_retries=3)
def process_chat_response(
    self,
    session_id: str,
    message_id: str,
    content: str,
    role: str,
    user_id: str | None = None,
    department: str | None = None,
) -> dict[str, Any]:
    """
    Xử lý tin nhắn chat: cắt đoạn → embedding → lưu vào Qdrant.
    """
    logger.info(f"[chat_priority] Processing message {message_id} for session {session_id}")
    try:
        from src.core.qdrant_setup import get_qdrant_client
        from qdrant_client.http import models as qmodels
        from .helpers import _smart_chunk

        # 1. Chunk text
        chunks = _smart_chunk(content, chunk_size=CHAT_CHUNK_SIZE, overlap=CHAT_CHUNK_OVERLAP)
        if not chunks:
            return {"status": "ok", "message_id": message_id, "chunks": 0}

        # 2. Embed each chunk locally (sentence-transformers)
        chunk_texts = [t for t, _ in chunks]
        with ThreadPoolExecutor(max_workers=min(len(chunk_texts), 8)) as pool:
            vectors = list(pool.map(embed_query, chunk_texts))

        if any(v is None for v in vectors):
            return {"status": "warning", "message_id": message_id}

        # 3. Store vectors in Qdrant
        qdrant = get_qdrant_client()
        points = []
        for i, ((chunk_text, page_num), vector) in enumerate(zip(chunks, vectors)):
            point_id = str(uuid4())
            points.append(qmodels.PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    "content": chunk_text,
                    "session_id": session_id,
                    "message_id": message_id,
                    "user_id": user_id or "",
                    "role": role,
                    "department": department or "",
                    "chunk_index": i,
                },
            ))

        if points:
            qdrant.upsert(collection_name="chat_chunks", points=points)
            logger.info(f"[chat_priority] Stored {len(points)} chunks for message {message_id}")

        return {"status": "ok", "message_id": message_id, "chunks": len(points)}
    except (qdrant_exc.UnexpectedResponse, qdrant_exc.ResponseHandlingException) as exc:
        logger.exception("Qdrant error processing chat response: %s", exc)
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)
    except (OSError, RuntimeError) as exc:
        logger.exception("Embedding/model error processing chat response: %s", exc)
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)


@celery_app.task(name="src.worker.tasks.store_memory", bind=True, max_retries=3)
def store_memory(
    self,
    user_id: str,
    content: str,
    role: str,
    session_id: str,
    department: str | None = None,
) -> dict[str, Any]:
    """
    Lưu ký ức dài hạn vào Mem0.
    POST to Mem0 /memories API with correct MemoryCreate schema.
    """
    logger.info(f"[chat_priority] Storing memory for user {user_id}")
    try:
        from src.core.mem0_local import add_memory

        add_memory(
            messages=[{"role": role, "content": content}],
            user_id=user_id,
            metadata={
                "session_id": session_id,
                "department": department,
            },
        )
        logger.info(f"[mem0] Memory stored for user {user_id}")
        return {"status": "ok", "user_id": user_id}

    except Exception as exc:  # Justified: Mem0 local lib may raise unpredictable errors
        logger.exception("Error storing memory (%s): %s", type(exc).__name__, exc)
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)


# ---------------------------------------------------------------------------
# RAG Celery task
# ---------------------------------------------------------------------------

@celery_app.task(name="src.worker.tasks.rag_document_search", bind=True, max_retries=2)
def rag_document_search(
    self,
    question: str,
    session_id: str,
    user_id: str | None = None,
    department: str | None = None,
    target_message_id: str | None = None,
) -> dict[str, Any]:
    """RAG Document Search — find and synthesize answers from uploaded documents."""
    logger.info(f"[RAG] Search for session {session_id}: {question[:50]}...")
    try:
        # 1. Search: enhance query → cache → hybrid → fallback → parent resolve
        hybrid_results, enhanced = _run_hybrid_search(
            question, user_id, department, embed_fn=embed_query,
        )

        # 2. Build context + citations from search results
        citations, context_blocks = _build_hybrid_context_and_citations(hybrid_results)
        context_text = "\n\n---\n\n".join(context_blocks).strip()
        logger.info(f"[RAG CONTEXT (Hybrid)]:\n{context_text}\n{'='*50}")

        # 3. Synthesize via LLM (with fallback)
        result_text = ""
        llm_error: str | None = None
        if context_text:
            try:
                unified_ctx = _gather_unified_context(
                    question, session_id, user_id, department,
                )
                result_text = _synthesize_with_llm(
                    question, context_text,
                    long_term_block=unified_ctx.get("long_term_block", ""),
                    summary_block=unified_ctx.get("summary_block", ""),
                    recent_block=unified_ctx.get("recent_block", ""),
                    system_prompt=unified_ctx.get("system_prompt", ""),
                )
            except (httpx.HTTPError, KeyError, ValueError) as e:
                llm_error = str(e)
                logger.error("[RAG] LLM synthesis FAILED: %s", e)

        if not result_text:
            result_text = _build_fallback_answer([] if llm_error else context_blocks)

        result_text = _sanitize_generated_answer(result_text)
        result_text += _format_citations_footer(citations)

        # 4. Save answer + metadata via Backend API
        _save_rag_result(result_text, session_id, target_message_id, hybrid_results, enhanced)

        logger.info(f"[RAG] Saved answer for session {session_id}")
        from .helpers import publish_task_complete
        publish_task_complete(session_id)
        return {"status": "success", "question": question, "citations": len(citations)}

    except Exception as exc:  # Justified: RAG pipeline orchestrator — must always save error response
        logger.exception("Error in RAG document search (%s): %s", type(exc).__name__, exc)
        _save_rag_error(session_id, target_message_id)
        from .helpers import publish_task_complete
        publish_task_complete(session_id)
        return {"status": "error", "message": str(exc)}


@celery_app.task(name="src.worker.tasks.process_feedback", bind=True, max_retries=2)
def process_feedback(
    self,
    message_id: str,
    is_liked: bool,
    reason: str | None = None,
) -> dict[str, Any]:
    """
    Self-Correction: Process user feedback on bot answers.

    Positive feedback → no action (reserved for future upranking).
    Negative feedback:
      1. Look up rag_chunk_ids stored in message metadata (set by rag_document_search).
      2. Mark those exact vectors as quality=low in Qdrant.
      3. Fallback: if no chunk_ids stored, embed the message and search by similarity.
    """
    logger.info(f"[chat_priority] Processing feedback for message {message_id}: liked={is_liked}")
    try:
        if is_liked:
            return {"status": "ok", "action": "positive_feedback"}

        from src.core.database_pool import db_pool
        from src.core.qdrant_setup import get_qdrant_client
        from qdrant_client.http import models as qmodels

        # 1. Get the disliked message + its stored RAG chunk IDs
        row = db_pool.execute_query_fetchone(
            "SELECT content, session_id, metadata FROM chat_messages WHERE id = :msg_id",
            {"msg_id": message_id},
        )
        if not row:
            return {"status": "error", "message": "Message not found"}

        msg_content, _session_id, msg_metadata = row[0], row[1], row[2]
        qdrant = get_qdrant_client()
        downgraded = 0

        # Strategy A: use exact chunk IDs stored at generation time (most accurate)
        stored_chunk_ids: list[str] = []
        if isinstance(msg_metadata, dict):
            stored_chunk_ids = msg_metadata.get("rag_chunk_ids") or []

        if stored_chunk_ids:
            qdrant.set_payload(
                collection_name="port_knowledge",
                payload={"quality": "low", "dislike_reason": reason or "unknown"},
                points=stored_chunk_ids,
            )
            downgraded = len(stored_chunk_ids)
            logger.info(
                f"[feedback] Marked {downgraded} exact chunk(s) as low_quality via stored IDs"
            )

        else:
            # Strategy B: fallback — embed the question (not the answer) to find source chunks.
            query_vector = embed_query(msg_content[:CHAT_EMBED_TRUNCATE])

            matches = qdrant.query_points(
                collection_name="port_knowledge",
                query=query_vector,
                limit=3,
            ).points

            for point in matches:
                if point.score and point.score > RAG_FEEDBACK_SIMILARITY:
                    qdrant.set_payload(
                        collection_name="port_knowledge",
                        payload={"quality": "low", "dislike_reason": reason or "unknown"},
                        points=[point.id],
                    )
                    downgraded += 1
                    logger.info(
                        f"[feedback] Marked vector {point.id} as low_quality "
                        "(fallback similarity)"
                    )

        return {
            "status": "ok",
            "action": "vectors_downgraded",
            "message_id": message_id,
            "downgraded": downgraded,
        }

    except (sqlalchemy.exc.SQLAlchemyError, qdrant_exc.UnexpectedResponse) as exc:
        logger.exception("Error processing feedback: %s", exc)
        return {"status": "error", "message": str(exc)}


# =============================================================================
# 🔴 QUEUE: chat_priority — Session Summary (Async)
# =============================================================================

@celery_app.task(name="src.worker.tasks.summarize_session_history", bind=True, max_retries=2)
def summarize_session_history(
    self,
    session_id: str,
    keep_count: int = SUMMARY_KEEP_COUNT,
    trim_tokens: int = SUMMARY_TRIM_TOKENS,
) -> dict[str, Any]:
    """
    Tóm tắt bất đồng bộ lịch sử hội thoại (Smart Summarization).

    Upgraded from "every 10 messages" to token-aware with keep window.
    - keep_count: number of most recent messages to leave unsummarized (S2B: 12)
    - trim_tokens: max tokens of conversation history to summarize
    - Uses improved S2B-ported summarization prompt
    - Keeps original messages in DB (summary is supplementary, not destructive)
    """
    logger.info(
        f"[summary] Summarizing session {session_id} "
        f"(keep_count={keep_count}, trim_tokens={trim_tokens})"
    )
    try:
        from src.core.database_pool import db_pool

        # 1. Fetch all messages
        rows = db_pool.execute_query_fetchall(
            "SELECT role, content FROM chat_messages "
            "WHERE session_id = :sid ORDER BY created_at ASC",
            {"sid": session_id}
        )

        if not rows:
            return {"status": "skip", "reason": "no messages"}

        msg_count = len(rows)

        # 2. Separate messages: summarize older ones, keep recent ones
        if msg_count <= keep_count:
            return {"status": "skip", "reason": "not enough messages to summarize"}

        messages_to_summarize = rows[:-keep_count]

        # 3. Build conversation text within trim_tokens budget
        from src.utils.token_estimator import estimate_tokens
        conversation_parts: list[str] = []
        tokens_used = 0
        for r in messages_to_summarize:
            content = r[1] or ""
            truncated = content[:200] + ("..." if len(content) > 200 else "")
            line = f"{r[0].upper()}: {truncated}"
            line_tokens = estimate_tokens(line)
            if tokens_used + line_tokens > trim_tokens:
                break
            conversation_parts.append(line)
            tokens_used += line_tokens

        conversation = "\n".join(conversation_parts)
        if not conversation.strip():
            return {"status": "skip", "reason": "conversation too short to summarize"}

        # 4. Call LLM with improved S2B-ported prompt
        openai_key = os.getenv("OPENAI_API_KEY", "")
        openai_base = os.getenv("OPENAI_BASE_URL", "https://ezaiapi.com")
        llm_model = os.getenv("LLM_MODEL_LIGHT", "gpt-5.3-codex")

        from src.utils.summarization import SUMMARY_PROMPT_VI
        from src.core.http_client import get_http_client
        client = get_http_client(timeout=60.0)
        resp = client.post(
            f"{openai_base.rstrip('/')}/chat/completions",
            headers={
                "Authorization": f"Bearer {openai_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": llm_model,
                "messages": [
                    {"role": "system", "content": SUMMARY_PROMPT_VI},
                    {"role": "user", "content": conversation},
                ],
                "temperature": 0.1,
                "max_tokens": 500,
            },
        )
        resp.raise_for_status()
        summary = resp.json()["choices"][0]["message"]["content"].strip()

        logger.info(f"[summary] Generated summary ({len(summary)} chars) for session {session_id}")

        # 5. Store summary in session metadata — safe JSON serialization
        import json as _json
        patch_payload = _json.dumps({
            "summary": summary,
            "message_count_at_summary": msg_count,
            "summarized_up_to": msg_count - keep_count,
        })
        db_pool.execute_query(
            "UPDATE chat_sessions SET metadata = "
            "COALESCE(metadata, '{}'::json)::jsonb || CAST(:patch AS jsonb) "
            "WHERE id = :sid",
            {"sid": session_id, "patch": patch_payload}
        )

        return {"status": "ok", "session_id": session_id, "summary_length": len(summary)}

    except (httpx.HTTPError, KeyError, ValueError) as exc:
        logger.exception("LLM/parsing error summarizing session: %s", exc)
        return {"status": "error", "message": str(exc)}
    except sqlalchemy.exc.SQLAlchemyError as exc:
        logger.exception("DB error summarizing session: %s", exc)
        return {"status": "error", "message": str(exc)}
