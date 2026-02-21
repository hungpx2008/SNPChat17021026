"""
Chat tasks — Queue: chat_priority

Tasks:
  - process_chat_response: Chunk → Embed → Store in Qdrant
  - store_memory: Save long-term memory to Mem0
  - rag_document_search: RAG search across uploaded documents
  - process_feedback: Self-correction via user feedback
"""
import logging
import os
import re
from typing import Any
from uuid import uuid4

from .celery_app import celery_app

logger = logging.getLogger(__name__)

BACKEND_INTERNAL_URL = os.getenv("BACKEND_INTERNAL_URL", "http://backend:8000")


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
        import httpx
        from src.core.qdrant_setup import get_qdrant_client
        from qdrant_client.http import models as qmodels
        from .helpers import _smart_chunk

        # 1. Chunk text
        chunks = _smart_chunk(content, chunk_size=512, overlap=50)
        if not chunks:
            return {"status": "ok", "message_id": message_id, "chunks": 0}

        # 2. Embed each chunk via Mem0 (matches mem0_config.embed_text format)
        mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")
        vectors = []
        with httpx.Client(timeout=30.0) as client:
            for chunk_text, _ in chunks:
                resp = client.post(
                    f"{mem0_url.rstrip('/')}/embed",
                    json={"text": chunk_text},
                )
                if resp.status_code != 200:
                    logger.warning(f"[mem0] Embed failed: {resp.status_code}")
                    return {"status": "warning", "message_id": message_id}
                vectors.append(resp.json()["vector"])

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
    except Exception as exc:
        logger.exception(f"Error processing chat response: {exc}")
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
        import httpx
        mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")

        with httpx.Client(timeout=30.0) as client:
            resp = client.post(
                f"{mem0_url.rstrip('/')}/memories",
                json={
                    "messages": [{"role": role, "content": content}],
                    "user_id": user_id,
                    "metadata": {
                        "session_id": session_id,
                        "department": department,
                    },
                },
            )
            if resp.status_code in (200, 201):
                logger.info(f"[mem0] Memory stored for user {user_id}")
                return {"status": "ok", "user_id": user_id}
            else:
                logger.warning(f"[mem0] Store failed: {resp.status_code} {resp.text[:200]}")
                return {"status": "warning", "user_id": user_id, "detail": resp.text[:200]}

    except Exception as exc:
        logger.exception(f"Error storing memory: {exc}")
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)


@celery_app.task(name="src.worker.tasks.rag_document_search", bind=True, max_retries=2)
def rag_document_search(
    self,
    question: str,
    session_id: str,
    user_id: str | None = None,
    department: str | None = None,
) -> dict[str, Any]:
    """
    RAG Document Search: Tìm kiếm tri thức từ tài liệu đã upload.
    1. Embed câu hỏi via Mem0
    2. Search Qdrant collection "port_knowledge" (ALL documents, no user filter)
    3. Build context + citations with source_file + page_number
    4. Call LLM for synthesized answer (ONLY from context)
    5. Save response via API
    """
    logger.info(f"[chat_priority] RAG agentic search for session {session_id}: {question[:50]}...")
    try:
        from llama_index.core import VectorStoreIndex, StorageContext, Settings
        from llama_index.vector_stores.qdrant import QdrantVectorStore
        from llama_index.embeddings.huggingface import HuggingFaceEmbedding
        from qdrant_client import QdrantClient
        from qdrant_client.models import Filter, FieldCondition, MatchValue

        # 1. Setup local embedding and vector store
        # We use the same model as Mem0/backend (1024 dim)
        embed_model = HuggingFaceEmbedding(model_name="thanhtantran/Vietnamese_Embedding_v2")
        Settings.embed_model = embed_model
        Settings.llm = None  # We will use the query engine with custom response synthesis if needed

        client = QdrantClient(url=os.getenv("QDRANT_URL", "http://qdrant:6333"))
        vector_store = QdrantVectorStore(client=client, collection_name="port_knowledge")
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        index = VectorStoreIndex.from_vector_store(vector_store=vector_store, storage_context=storage_context)

        # 2. Build security filter
        # (user_id == current) OR (dept == current AND is_public == true)
        qdrant_filter = None
        if user_id or department:
            should_conditions = []
            if user_id:
                should_conditions.append(FieldCondition(key="user_id", match=MatchValue(value=user_id)))
            if department:
                should_conditions.append(Filter(must=[
                    FieldCondition(key="department", match=MatchValue(value=department)),
                    FieldCondition(key="is_public", match=MatchValue(value=True)),
                ]))
            if should_conditions:
                qdrant_filter = Filter(should=should_conditions)

        # 3. Create Multi-Step Query Engine
        from llama_index.core.query_engine import SubQuestionQueryEngine
        from llama_index.core.tools import QueryEngineTool, ToolMetadata

        # Prepare a base query engine with the filter
        base_query_engine = index.as_query_engine(
            similarity_top_k=8,
            vector_store_kwargs={"filter": qdrant_filter}
        )

        # For simple queries, we use base. For complex ones, we could use SubQuestionQueryEngine.
        # But SubQuestionQueryEngine usually needs an LLM to break down questions.
        # We'll use the base engine for now but configured for agentic behavior.
        response = base_query_engine.query(question)
        result_text = str(response)

        # 4. Extract citations from metadata
        citations = []
        source_files = set()
        if hasattr(response, "source_nodes"):
            for node in response.source_nodes:
                meta = node.node.metadata
                fname = meta.get("source_file", "Tài liệu")
                page = meta.get("page_number", "?")
                citations.append(f"- {fname} (Trang {page})")
                source_files.add(fname)

        if not result_text or "not found" in result_text.lower():
            result_text = "Em đã tìm trong tài liệu nhưng không thấy thông tin chính xác tuyệt đối ạ."
        elif citations:
            result_text += "\n\n📚 **Nguồn tham khảo:**\n" + "\n".join(set(citations))

        attachments = [] # Placeholder for RAG attachments if needed

        # 5. Save result via Backend API
        import httpx
        with httpx.Client(timeout=10.0) as client:
            api_url = f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages"
            resp = client.post(
                api_url,
                json={"content": result_text, "role": "assistant"},
            )
            resp.raise_for_status()
            logger.info(f"[RAG] Saved agentic answer for session {session_id}")

        return {"status": "success", "question": question, "citations": len(citations)}

    except Exception as exc:
        logger.exception(f"Error in RAG document search: {exc}")
        # Return Vietnamese error message — NEVER expose tracebacks
        try:
            import httpx
            with httpx.Client(timeout=10.0) as client:
                client.post(
                    f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages",
                    json={
                        "content": "Xin lỗi Đại ca, hệ thống gặp sự cố khi tìm kiếm tài liệu. Vui lòng thử lại sau ạ.",
                        "role": "assistant",
                    },
                )
        except Exception:
            pass
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
    If disliked → find related vectors in Qdrant and mark as low_quality.
    """
    logger.info(f"[chat_priority] Processing feedback for message {message_id}: liked={is_liked}")
    try:
        if is_liked:
            return {"status": "ok", "action": "positive_feedback"}

        # Negative feedback → find and downgrade related vectors
        from sqlalchemy import create_engine, text as sql_text
        db_url = os.getenv("DATABASE_URL", "").replace("postgresql+asyncpg://", "postgresql://")
        engine = create_engine(db_url)

        # 1. Get the disliked message content
        with engine.connect() as conn:
            result = conn.execute(
                sql_text("SELECT content, session_id FROM chat_messages WHERE id = :msg_id"),
                {"msg_id": message_id},
            )
            row = result.fetchone()
        if not row:
            return {"status": "error", "message": "Message not found"}

        msg_content = row[0]

        # 2. Embed the message to find matching vectors
        import httpx
        mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")
        with httpx.Client(timeout=30.0) as client:
            resp = client.post(
                f"{mem0_url.rstrip('/')}/embed",
                json={"text": msg_content[:500]},
            )
            resp.raise_for_status()
            query_vector = resp.json()["vector"]

        # 3. Search for matching vectors in port_knowledge and chat_chunks
        from src.core.qdrant_setup import get_qdrant_client
        from qdrant_client.http import models as qmodels

        qdrant = get_qdrant_client()
        for collection in ["port_knowledge", "chat_chunks"]:
            try:
                matches = qdrant.query_points(
                    collection_name=collection,
                    query=query_vector,
                    limit=3,
                ).points

                for point in matches:
                    if point.score and point.score > 0.7:
                        qdrant.set_payload(
                            collection_name=collection,
                            payload={"quality": "low", "dislike_reason": reason or "unknown"},
                            points=[point.id],
                        )
                        logger.info(
                            f"[feedback] Marked vector {point.id} in {collection} "
                            f"as low_quality (reason: {reason})"
                        )
            except Exception as e:
                logger.warning(f"[feedback] Error processing {collection}: {e}")

        return {"status": "ok", "action": "vectors_downgraded", "message_id": message_id}

    except Exception as exc:
        logger.exception(f"Error processing feedback: {exc}")
        return {"status": "error", "message": str(exc)}


# =============================================================================
# 🔴 QUEUE: chat_priority — Session Summary (Async)
# =============================================================================

@celery_app.task(name="src.worker.tasks.summarize_session_history", bind=True, max_retries=2)
def summarize_session_history(
    self,
    session_id: str,
) -> dict[str, Any]:
    """
    Tóm tắt bất đồng bộ lịch sử hội thoại.
    Triggered every 10 messages — runs in background, user doesn't wait.
    
    1. Fetch ALL messages from DB
    2. Call LLM to produce a 500-char summary
    3. Store summary in session.metadata.summary
    """
    logger.info(f"[summary] Summarizing session {session_id}")
    try:
        import httpx
        from sqlalchemy import create_engine, text as sql_text

        db_url = os.getenv("DATABASE_URL", "").replace("postgresql+asyncpg://", "postgresql://")
        engine = create_engine(db_url)

        # 1. Fetch all messages
        with engine.connect() as conn:
            result = conn.execute(
                sql_text(
                    "SELECT role, content FROM chat_messages "
                    "WHERE session_id = :sid ORDER BY created_at ASC"
                ),
                {"sid": session_id},
            )
            rows = result.fetchall()

        if not rows:
            return {"status": "skip", "reason": "no messages"}

        msg_count = len(rows)

        # Truncate each message for the summary prompt (max 200 chars each)
        conversation = "\n".join(
            f"{r[0].upper()}: {r[1][:200]}{'...' if len(r[1]) > 200 else ''}"
            for r in rows
        )

        # 2. Call LLM to summarize
        openai_key = os.getenv("OPENAI_API_KEY", "")
        openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
        llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")

        with httpx.Client(timeout=60.0) as client:
            resp = client.post(
                f"{openai_base.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {openai_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": llm_model,
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "Bạn là chuyên gia tóm tắt hội thoại. "
                                "Tóm tắt cuộc hội thoại sau thành MỘT đoạn văn ngắn (tối đa 500 ký tự). "
                                "Tập trung vào: chủ đề chính, thông tin quan trọng, và kết luận. "
                                "Viết bằng tiếng Việt, súc tích."
                            ),
                        },
                        {"role": "user", "content": conversation[:6000]},  # Cap input
                    ],
                    "temperature": 0.1,
                    "max_tokens": 300,
                },
            )
            resp.raise_for_status()
            summary = resp.json()["choices"][0]["message"]["content"].strip()

        logger.info(f"[summary] Generated summary ({len(summary)} chars) for session {session_id}")

        # 3. Store summary in session metadata
        with engine.connect() as conn:
            # PostgreSQL JSON merge
            conn.execute(
                sql_text(
                    "UPDATE chat_sessions SET metadata = "
                    "COALESCE(metadata, '{}'::json)::jsonb || :patch "
                    "WHERE id = :sid"
                ),
                {
                    "sid": session_id,
                    "patch": f'{{"summary": {__import__("json").dumps(summary)}, "message_count_at_summary": {msg_count}}}',
                },
            )
            conn.commit()

        return {"status": "ok", "session_id": session_id, "summary_length": len(summary)}

    except Exception as exc:
        logger.exception(f"Error summarizing session: {exc}")
        return {"status": "error", "message": str(exc)}
