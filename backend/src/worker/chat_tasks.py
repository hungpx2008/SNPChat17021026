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
from concurrent.futures import ThreadPoolExecutor
from typing import Any
from uuid import uuid4

from .celery_app import celery_app

logger = logging.getLogger(__name__)

BACKEND_INTERNAL_URL = os.getenv("BACKEND_INTERNAL_URL", "http://backend:8000")
MEM0_DEFAULT_URL = "http://mem0:8000"


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
        chunks = _smart_chunk(content, chunk_size=512, overlap=50)
        if not chunks:
            return {"status": "ok", "message_id": message_id, "chunks": 0}

        # 2. Embed each chunk via Mem0 — parallel with ThreadPoolExecutor
        mem0_url = os.getenv("MEM0_URL", MEM0_DEFAULT_URL)
        embed_url = f"{mem0_url.rstrip('/')}/embed"

        def _embed_chunk(chunk_text: str) -> list[float] | None:
            import httpx
            resp = httpx.post(embed_url, json={"text": chunk_text}, timeout=30.0)
            if resp.status_code != 200:
                logger.warning(f"[mem0] Embed failed: {resp.status_code}")
                return None
            return resp.json()["vector"]

        chunk_texts = [t for t, _ in chunks]
        with ThreadPoolExecutor(max_workers=min(len(chunk_texts), 8)) as pool:
            vectors = list(pool.map(_embed_chunk, chunk_texts))

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
        mem0_url = os.getenv("MEM0_URL", MEM0_DEFAULT_URL)

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


# ---------------------------------------------------------------------------
# RAG helper functions (extracted to reduce cognitive complexity)
# ---------------------------------------------------------------------------

def _build_qdrant_filter(user_id: str | None, department: str | None):
    """Build Qdrant security filter for RAG search."""
    from qdrant_client.models import Filter, FieldCondition, MatchValue

    if not user_id and not department:
        return None
    should_conditions = []
    if user_id:
        should_conditions.append(
            FieldCondition(key="user_id", match=MatchValue(value=user_id))
        )
    if department:
        should_conditions.append(Filter(must=[
            FieldCondition(key="department", match=MatchValue(value=department)),
            FieldCondition(key="is_public", match=MatchValue(value=True)),
        ]))
    return Filter(should=should_conditions) if should_conditions else None


def _extract_node_metadata(node_with_score) -> tuple[str, Any]:
    """Extract filename and page display from a LlamaIndex node."""
    try:
        meta = node_with_score.node.metadata or {}
    except Exception:
        meta = {}
    fname = meta.get("source_file", "Tài liệu")
    page = (
        meta.get("page_number") or meta.get("page")
        or meta.get("page_no") or meta.get("pageIndex")
        or meta.get("page_index")
    )
    try:
        page = int(page) if page is not None else None
    except Exception:
        page = None
    page_display = page if page is not None else meta.get("chunk_index", "?")
    return fname, page_display


def _extract_snippet(node_with_score) -> str:
    """Extract clean text content from a LlamaIndex node (no metadata)."""
    if hasattr(node_with_score, "text") and node_with_score.text:
        return node_with_score.text.strip()
    try:
        return node_with_score.node.get_content(metadata_mode="none").strip()
    except Exception:
        return str(node_with_score).strip()


def _build_context_and_citations(top_nodes: list) -> tuple[list[dict[str, Any]], list[str]]:
    """Parse retrieval nodes into deduplicated citations and context blocks."""
    citations: list[dict[str, Any]] = []
    context_blocks: list[str] = []
    seen_citations: set[str] = set()
    seen_content: set[str] = set()  # ← Thêm dedup theo nội dung

    for idx, node in enumerate(top_nodes, start=1):
        fname, page_display = _extract_node_metadata(node)
        cite_key = f"{fname}|{page_display}"
        snippet = _extract_snippet(node)

        # Tạo content hash để check trùng lặp nội dung
        content_hash = hash(snippet.strip()[:200]) if snippet else None

        # Skip nếu nội dung đã xuất hiện (dedup mạnh hơn)
        if content_hash and content_hash in seen_content:
            continue

        if cite_key not in seen_citations:
            seen_citations.add(cite_key)
            score = getattr(node, "score", None)
            citations.append({
                "index": len(citations) + 1,
                "file": fname, "page": page_display,
                "score": round(score, 3) if score else None,
            })

        if snippet and content_hash:
            seen_content.add(content_hash)  # ← Mark nội dung đã thấy
            cite_idx = next(
                (c["index"] for c in citations if c["file"] == fname and c["page"] == page_display),
                len(citations),  # Fallback to last citation index
            )
            context_blocks.append(f"[{cite_idx}] {snippet}")
    return citations, context_blocks


def _gather_unified_context(question: str, session_id: str, user_id: str | None) -> dict[str, str]:
    """Collect long-term memory, session summary, and recent chat for unified prompting."""
    long_term_block = ""
    summary_block = ""
    recent_block = ""

    # Long-term memories via Mem0 (best effort)
    if user_id:
        try:
            import httpx
            mem0_url = os.getenv("MEM0_URL", MEM0_DEFAULT_URL)
            with httpx.Client(timeout=10.0) as client:
                resp = client.post(
                    f"{mem0_url.rstrip('/')}/search",
                    json={"query": question, "user_id": user_id, "limit": 5},
                )
                if resp.status_code == 200:
                    results = resp.json().get("results") or []
                    if results:
                        long_term_block = "\n".join(
                            f"- {item.get('text') or item.get('memory') or ''}" for item in results
                        ).strip()
        except Exception as e:
            logger.warning(f"[RAG] Mem0 long-term fetch failed: {e}")

    # Session summary + recent messages via DB (sync)
    try:
        from sqlalchemy import create_engine, text as sql_text

        db_url = os.getenv("DATABASE_URL", "").replace("postgresql+asyncpg://", "postgresql://")
        engine = create_engine(db_url)
        with engine.connect() as conn:
            # Summary
            res = conn.execute(
                sql_text("SELECT metadata FROM chat_sessions WHERE id = :sid"),
                {"sid": session_id},
            ).fetchone()
            if res and res[0]:
                meta = res[0]
                if isinstance(meta, dict) and meta.get("summary"):
                    summary_block = str(meta["summary"])

            # Recent messages (last 6)
            rows = conn.execute(
                sql_text(
                    "SELECT role, content FROM chat_messages "
                    "WHERE session_id = :sid ORDER BY created_at DESC LIMIT 6"
                ),
                {"sid": session_id},
            ).fetchall()
            if rows:
                rows = list(reversed(rows))
                recent_block = "\n".join(f"{r[0].upper()}: {r[1]}" for r in rows)
    except Exception as e:
        logger.warning(f"[RAG] Recent history fetch failed: {e}")

    return {
        "long_term_block": long_term_block,
        "summary_block": summary_block,
        "recent_block": recent_block,
    }


_RAG_SYSTEM_PROMPT = (
    "🤖 Bạn là AI Assistant thông minh và chuyên nghiệp của ChatSNP. "
    "Nhiệm vụ: biến thông tin thô thành câu trả lời SINH ĐỘNG, DỄ HIỂU, CÓ GIÁ TRỊ.\n\n"

    "📋 QUY TẮC VÀNG:\n"
    "✅ CHỈ dùng thông tin từ tài liệu được cung cấp\n"
    "✅ Viết bằng tiếng Việt tự nhiên, dễ hiểu\n"
    "✅ Tạo cấu trúc rõ ràng với tiêu đề đẹp\n"
    "✅ Tóm tắt ngắn gọn ở đầu, chi tiết bên dưới\n"
    "❌ TUYỆT ĐỐI không bịa đặt thông tin\n"
    "❌ Không hiển thị metadata kỹ thuật\n"
    "❌ Không copy nguyên văn câu hỏi\n\n"

    "🎨 CẤU TRÚC TRẢ LỜI:\n"
    "**Bước 1:** Mở đầu bằng 1-2 câu tóm tắt cốt lõi 💡\n"
    "**Bước 2:** Phân chia thành các mục chính với emoji và tiêu đề đẹp:\n"
    "   • 📊 **Số liệu quan trọng** (nếu có)\n"
    "   • 🔍 **Chi tiết cụ thể**\n"
    "   • ⚡ **Điểm nổi bật**\n"
    "**Bước 3:** Kết thúc bằng takeaway quan trọng 🎯\n\n"

    "📝 NGUYÊN TẮC VIẾT:\n"
    "• Dùng **heading in đậm** cho mục chính\n"
    "• Bullet points (•) cho danh sách\n"
    "• Bảng markdown cho số liệu phức tạp\n"
    "• Emoji phù hợp để tạo điểm nhấn\n"
    "• Trích dẫn [1], [2]... sau mỗi thông tin quan trọng\n\n"

    "💫 VÍ DỤ MẪU:\n"
    "💰 **Biểu giá dịch vụ cầu bến** hiện tại có những thay đổi quan trọng từ đầu năm 2026.\n\n"
    "📋 **Chi tiết giá cước:**\n"
    "| Loại hàng hóa | Đơn giá | Ghi chú |\n"
    "|---|---|---|\n"
    "| Container 20ft | 150.000 VNĐ | Áp dụng từ 01/2026 [1] |\n"
    "| Container 40ft | 280.000 VNĐ | Giá ưu đãi [1] |\n\n"
    "⚡ **Những điểm cần lưu ý:**\n"
    "• 🆓 Miễn phí lưu bãi trong 3 ngày đầu tiên [2]\n"
    "• 💸 Phụ phí THC áp dụng cho hàng hóa vượt tải [2]\n\n"
    "🎯 **Kết luận:** Giá cước mới giúp tối ưu chi phí vận chuyển cho doanh nghiệp."
)


def _synthesize_with_llm(
    question: str,
    context_text: str,
    *,
    long_term_block: str = "",
    summary_block: str = "",
    recent_block: str = "",
) -> str:
    """Call LLM (GPT-5 Nano via OpenRouter) to synthesize a clean answer."""
    import httpx

    openai_key = os.getenv("OPENAI_API_KEY", "")
    openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
    llm_model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")

    unified_context_parts = []
    if long_term_block:
        unified_context_parts.append("### Long-term Memory\n" + long_term_block)
    if summary_block:
        unified_context_parts.append("### Tóm tắt hội thoại\n" + summary_block)
    if recent_block:
        unified_context_parts.append("### Hội thoại gần đây\n" + recent_block)
    unified_context_parts.append("### Đoạn trích tài liệu (đã đánh số)\n" + context_text)
    unified_context = "\n\n".join(unified_context_parts)

    user_prompt = (
        f"🔍 **Câu hỏi từ người dùng:** {question}\n\n"
        "📚 **CONTEXT (ưu tiên theo thứ tự):**\n\n"
        f"{unified_context}\n\n"
        "🎯 **Yêu cầu:** Hãy biến những thông tin thô này thành câu trả lời CHUYÊN NGHIỆP, "
        "SINH ĐỘNG và DỄ HIỂU. Tập trung vào giá trị thực tế mà người dùng cần biết!"
    )
    with httpx.Client(timeout=60.0) as http_client:
        resp = http_client.post(
            f"{openai_base.rstrip('/')}/chat/completions",
            headers={"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"},
            json={
                "model": llm_model,
                "messages": [
                    {"role": "system", "content": _RAG_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.3,
                "max_tokens": 1500,
            },
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"].strip()


def _build_fallback_answer(context_blocks: list[str]) -> str:
    """Build a clean fallback when LLM synthesis fails."""
    if not context_blocks:
        return (
            "🔍 **Kết quả tìm kiếm:**\n\n"
            "😔 Em đã tìm kiếm kỹ lưỡng trong toàn bộ tài liệu nhưng chưa tìm thấy "
            "thông tin phù hợp với câu hỏi của bạn.\n\n"
            "💡 **Gợi ý:**\n"
            "• Thử đặt câu hỏi chi tiết hơn\n"
            "• Kiểm tra lại từ khóa tìm kiếm\n"
            "• Đảm bảo tài liệu liên quan đã được upload\n\n"
            "🤝 Em sẵn sàng hỗ trợ bạn tìm kiếm thông tin khác!"
        )

    lines = ["📋 **Thông tin liên quan từ tài liệu:**\n"]

    for i, block in enumerate(context_blocks, 1):
        clean = re.sub(r'^\[\d+\]\s*', '', block).strip()
        lines.append(f"**{i}.** {clean}\n")

    lines.append("\n💬 **Lưu ý:** Đây là thông tin thô từ tài liệu, bạn có thể hỏi cụ thể hơn để em tổng hợp chi tiết!")
    return "\n".join(lines)


def _format_citations_footer(citations: list[dict[str, Any]]) -> str:
    """Format citations into a beautiful markdown footer."""
    if not citations:
        return ""

    cite_lines = ["---", "📚 **Nguồn tham khảo:**"]
    for c in citations:
        score_str = f" — độ liên quan: {c['score']}" if c.get("score") else ""
        cite_lines.append(f"- **[{c['index']}]** {c['file']} (Trang {c['page']}){score_str}")

    return "\n" + "\n".join(cite_lines)


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
) -> dict[str, Any]:
    """
    RAG Document Search — find and synthesize answers from uploaded documents.
    """
    logger.info(f"[RAG] Search for session {session_id}: {question[:50]}...")
    try:
        from llama_index.core import VectorStoreIndex, StorageContext, Settings
        from llama_index.vector_stores.qdrant import QdrantVectorStore
        from llama_index.embeddings.huggingface import HuggingFaceEmbedding
        from qdrant_client import QdrantClient

        # 1. Setup embedding + vector store
        Settings.embed_model = HuggingFaceEmbedding(model_name="thanhtantran/Vietnamese_Embedding_v2")
        Settings.llm = None
        qdrant = QdrantClient(url=os.getenv("QDRANT_URL", "http://qdrant:6333"))
        vector_store = QdrantVectorStore(client=qdrant, collection_name="port_knowledge")
        storage_ctx = StorageContext.from_defaults(vector_store=vector_store)
        index = VectorStoreIndex.from_vector_store(vector_store=vector_store, storage_context=storage_ctx)

        # 2. Retrieve top-5 chunks
        retriever = index.as_retriever(
            similarity_top_k=5,
            vector_store_kwargs={"filter": _build_qdrant_filter(user_id, department)},
        )
        top_nodes = list(retriever.retrieve(question))[:5]

        # 3. Build context + citations
        citations, context_blocks = _build_context_and_citations(top_nodes)
        context_text = "\n\n---\n\n".join(context_blocks).strip()

        # 4. Synthesize via LLM (with fallback)
        result_text = ""
        if context_text:
            try:
                unified_ctx = _gather_unified_context(question, session_id, user_id)
                result_text = _synthesize_with_llm(
                    question,
                    context_text,
                    long_term_block=unified_ctx.get("long_term_block", ""),
                    summary_block=unified_ctx.get("summary_block", ""),
                    recent_block=unified_ctx.get("recent_block", ""),
                )
            except Exception as e:
                logger.warning(f"[RAG] LLM synthesis failed: {e}")
        if not result_text:
            result_text = _build_fallback_answer(context_blocks)

        result_text += _format_citations_footer(citations)

        # 5. Save via Backend API
        import httpx
        with httpx.Client(timeout=10.0) as http_client:
            resp = http_client.post(
                f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages",
                json={"content": result_text, "role": "assistant"},
            )
            resp.raise_for_status()
            logger.info(f"[RAG] Saved answer for session {session_id}")

        from .helpers import publish_task_complete
        publish_task_complete(session_id)
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
                        "content": "Xin lỗi, hệ thống gặp sự cố khi tìm kiếm tài liệu. Vui lòng thử lại sau ạ.",
                        "role": "assistant",
                    },
                )
        except Exception:
            pass
        # Still notify frontend so it stops waiting
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
        mem0_url = os.getenv("MEM0_URL", MEM0_DEFAULT_URL)
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
        llm_model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")

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
