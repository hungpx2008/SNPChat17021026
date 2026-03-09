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

# Minimum cosine similarity score for a retrieved chunk to be included in RAG context.
# Chunks below this threshold are discarded even if they are "top-k".
RAG_SCORE_THRESHOLD = float(os.getenv("RAG_SCORE_THRESHOLD", "0.35"))

# ---------------------------------------------------------------------------
# Module-level singleton for the HuggingFace embedding model used in retrieval.
# Loading ~1.3 GB model once per worker process instead of once per request.
# ---------------------------------------------------------------------------
_hf_embed_model = None
_hf_embed_model_name: str | None = None


def _get_hf_embed_model():
    """Return a cached HuggingFaceEmbedding instance (loaded once per Celery worker)."""
    global _hf_embed_model, _hf_embed_model_name  # noqa: PLW0603
    model_name = os.getenv("EMBEDDING_MODEL", "thanhtantran/Vietnamese_Embedding_v2")
    if _hf_embed_model is None or _hf_embed_model_name != model_name:
        from llama_index.embeddings.huggingface import HuggingFaceEmbedding
        logger.info(f"[RAG] Loading HuggingFace embedding model: {model_name}")
        _hf_embed_model = HuggingFaceEmbedding(model_name=model_name)
        _hf_embed_model_name = model_name
        logger.info(f"[RAG] Embedding model loaded and cached.")
    return _hf_embed_model


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
            from src.core.http_client import get_http_client
            resp = get_http_client(timeout=30.0).post(embed_url, json={"text": chunk_text})
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
        from src.core.http_client import get_http_client
        mem0_url = os.getenv("MEM0_URL", MEM0_DEFAULT_URL)

        client = get_http_client(timeout=300.0)
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
    """Build Qdrant security + quality filter for RAG search.

    Access control (OR):
      - chunks owned by this user_id, OR
      - public chunks belonging to this department

    Quality gate (must NOT):
      - exclude any chunk marked quality=low via negative feedback
    """
    from qdrant_client.models import Filter, FieldCondition, MatchValue, IsEmptyCondition, IsNullCondition

    # Access control: user's own chunks OR department-public chunks
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

    # Quality gate: exclude chunks explicitly marked as low quality via feedback
    must_not_conditions = [
        FieldCondition(key="quality", match=MatchValue(value="low")),
    ]

    if should_conditions:
        return Filter(
            should=should_conditions,
            must_not=must_not_conditions,
        )
    # No access constraints — only apply quality filter
    return Filter(must_not=must_not_conditions)


def _extract_node_metadata(node_with_score) -> dict[str, Any]:
    """Extract metadata (filename, page, doc_id, headings) from a LlamaIndex node."""
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
    doc_id = meta.get("document_id")
    headings = meta.get("headings", [])
    try:
        page = int(page) if page is not None else None
    except Exception:
        page = None
    page_display = page if page is not None else meta.get("chunk_index", "?")

    return {
        "file": fname,
        "page": page_display,
        "doc_id": doc_id,
        "headings": headings if isinstance(headings, list) else [headings] if headings else [],
    }


def _clean_snippet_text(text: str) -> str:
    """Sanitize raw snippet text before sending to LLM.

    Handles:
    - Raw HTML tags from Docling table export (<td>, <tr>, <table>, etc.)
    - Windows line endings (\r\n) → Unix (\n)
    - Tab characters → space separator
    - Lines containing ONLY numbers/prices scattered across (table debris) → joined with context
    - Stray whitespace / redundant blank lines
    """
    # 0. Normalize Windows line endings
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # 1. Remove HTML tags
    text = re.sub(r"<[^>]+>", "", text)

    # 2. Convert tabs to space (prevent tab-split confusion)
    text = text.replace("\t", " ")

    # 3. Collapse multiple spaces to single space (per line)
    lines = text.splitlines()
    cleaned_lines = []
    for line in lines:
        cleaned_lines.append(re.sub(r"  +", " ", line).strip())
    text = "\n".join(cleaned_lines)

    # 4. Collapse 3+ blank lines → single blank line
    text = re.sub(r"\n{3,}", "\n\n", text)

    # 5. Remove lines that are purely whitespace
    text = "\n".join(ln for ln in text.splitlines() if ln.strip())

    return text.strip()


def _extract_snippet(node_with_score) -> str:
    """Extract clean text content from a LlamaIndex node (no metadata)."""
    if hasattr(node_with_score, "text") and node_with_score.text:
        return _clean_snippet_text(node_with_score.text)
    try:
        raw = node_with_score.node.get_content(metadata_mode="none").strip()
        return _clean_snippet_text(raw)
    except Exception:
        return _clean_snippet_text(str(node_with_score))


def _build_context_and_citations(top_nodes: list) -> tuple[list[dict[str, Any]], list[str]]:
    """Parse retrieval nodes into deduplicated citations and context blocks.

    Deduplication strategy:
    - cite_key = (filename, page): same page from same doc counts as ONE citation
    - content_hash: near-duplicate snippets (first 200 chars) are dropped entirely
    """
    citations: list[dict[str, Any]] = []
    context_blocks: list[str] = []
    seen_citations: set[str] = set()
    seen_content: set[int] = set()

    for node in top_nodes:
        meta = _extract_node_metadata(node)
        fname = meta["file"]
        page_display = meta["page"]
        doc_id = meta["doc_id"]
        headings = meta["headings"]

        snippet = _extract_snippet(node)

        if not snippet:
            continue

        content_hash = hash(snippet.strip()[:200])
        # Drop exact-duplicate content regardless of source
        if content_hash in seen_content:
            continue
        seen_content.add(content_hash)

        # Append image download hint for image documents
        ext = fname.lower().split('.')[-1] if '.' in fname else ""
        if ext in ["jpg", "jpeg", "png"] and doc_id:
            snippet += f"\n[LƯU Ý QUAN TRỌNG: Link Tải ảnh gốc là `/api/upload/{doc_id}/download`]"

        # Phân biệt citation bằng file + page + heading (gần nhau)
        heading_key = "|".join(str(h) for h in headings[:2]) if headings else ""
        cite_key = f"{fname}|{page_display}|{heading_key}"

        if cite_key not in seen_citations:
            seen_citations.add(cite_key)
            score = getattr(node, "score", None)
            citations.append({
                "index": len(citations) + 1,
                "file": fname,
                "page": page_display,
                "headings": headings,
                "score": round(score, 3) if score else None,
            })

        # Always safe: cite_key is guaranteed to be in citations at this point
        # Tìm citation dựa trên metadata hiện tại
        cite_idx = next(
            c["index"] for c in citations 
            if c["file"] == fname and c["page"] == page_display and c.get("headings", []) == headings
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
            from src.core.http_client import get_http_client
            mem0_url = os.getenv("MEM0_URL", MEM0_DEFAULT_URL)
            client = get_http_client(timeout=10.0)
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

    # Session summary + recent messages via DB — single JOIN query (was 2 separate queries)
    try:
        from src.core.database_pool import db_pool

        rows = db_pool.execute_query_fetchall(
            """
            SELECT
                s.metadata AS session_meta,
                m.role,
                m.content
            FROM chat_sessions s
            LEFT JOIN (
                SELECT session_id, role, content, created_at
                FROM chat_messages
                WHERE session_id = :sid
                ORDER BY created_at DESC
                LIMIT 6
            ) m ON m.session_id = s.id
            WHERE s.id = :sid
            """,
            {"sid": session_id}
        )
        if rows:
            # First row always contains session metadata
            meta = rows[0][0]
            if isinstance(meta, dict) and meta.get("summary"):
                summary_block = str(meta["summary"])
            # Collect message rows (role/content not null)
            msg_rows = [(r[1], r[2]) for r in rows if r[1] is not None]
            if msg_rows:
                msg_rows = list(reversed(msg_rows))
                recent_block = "\n".join(f"{r[0].upper()}: {r[1]}" for r in msg_rows)
    except Exception as e:
        logger.warning(f"[RAG] Recent history fetch failed: {e}")

    return {
        "long_term_block": long_term_block,
        "summary_block": summary_block,
        "recent_block": recent_block,
    }


_RAG_SYSTEM_PROMPT = (
    "Bạn là chuyên viên tư vấn nhiệt tình, chuyên nghiệp của ChatSNP (Tân Cảng Sài Gòn).\n"
    "Nhiệm vụ của bạn là dựa vào tài liệu được cung cấp để giải đáp chính xác, rõ ràng cho khách hàng.\n"
    "YÊU CẦU ĐỊNH DẠNG:\n"
    "- Trả lời tự nhiên, lịch sự, đầy đủ ý nhưng không lan man.\n"
    "- Bạn ĐƯỢC PHÉP dùng bullet points, xuống dòng để trình bày rõ ràng nếu thông tin dài.\n"
    "- Khi context chứa dữ liệu dạng bảng (tbl_cell, row_key, col_key), BẮT BUỘC phải trình bày lại thành bảng Markdown chuẩn.\n"
    "  Ví dụ cú pháp bảng Markdown:\n"
    "  | Loại container | 20' | 40' | 45' |\n"
    "  |---|---|---|---|\n"
    "  | Hàng khô | 1.230.000 | 1.835.000 | 1.835.000 |\n"
    "- Giữ nguyên đơn vị tiền tệ gốc (VNĐ, USD). Không làm tròn, không đổi đơn vị.\n"
    "- Trích dẫn nguồn bằng cách thêm [1], [2]... vào cuối câu hoặc cuối đoạn lấy thông tin.\n"
    "- Tuyệt đối không bịa số liệu. Nếu tài liệu không đề cập, hãy nói rõ là chưa có thông tin và mời khách liên hệ hotline 1800 1188.\n"
)


def _synthesize_with_llm(
    question: str,
    context_text: str,
    *,
    long_term_block: str = "",
    summary_block: str = "",
    recent_block: str = "",
) -> str:
    """Call LLM via OpenRouter to synthesize a clean answer."""
    openai_key = os.getenv("OPENAI_API_KEY", "")
    openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
    # gpt-5-nano là reasoning model — trả content="" → dùng gpt-4o-mini làm default
    llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")

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
        f"Câu hỏi người dùng: {question}\n\n"
        "Context:\n\n"
        f"{unified_context}\n\n"
        "Yêu cầu: Hãy phân tích kỹ Context để trả lời đầy đủ, chi tiết (được phép định dạng bảng, bullet nếu cần thiết)."
    )
    from src.core.http_client import get_http_client
    http_client = get_http_client()

    try:
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
        content = resp.json()["choices"][0]["message"]["content"]
        if not content or not content.strip():
            # Reasoning models (gpt-5-nano, o1, etc.) đôi khi trả content="" — raise để trigger fallback
            raise ValueError(
                f"LLM returned empty content (model={llm_model}). "
                "Likely a reasoning-only model. Set LLM_MODEL=openai/gpt-4o-mini in .env"
            )
        return content.strip()
    except Exception as e:
        logger.error(f"[LLM] Synthesis failed: {e}")
        raise


def _strip_markdown_tables(text: str) -> str:
    """Remove markdown table blocks from model output."""
    lines = text.splitlines()
    out: list[str] = []
    i = 0

    while i < len(lines):
        line = lines[i]
        is_table_row = bool(re.match(r"^\s*\|.*\|\s*$", line))
        is_sep_row = (
            i + 1 < len(lines)
            and bool(re.match(r"^\s*\|(?:\s*:?-+:?\s*\|)+\s*$", lines[i + 1]))
        )

        if is_table_row and is_sep_row:
            i += 2
            while i < len(lines) and re.match(r"^\s*\|.*\|\s*$", lines[i]):
                i += 1
            continue

        # Drop broken pipe-heavy lines (often malformed table debris)
        if line.count("|") >= 3 and not re.search(r"[A-Za-zÀ-ỹ0-9]", line):
            i += 1
            continue

        out.append(line)
        i += 1

    return "\n".join(out)


def _split_sentences_vi(text: str) -> list[str]:
    """
    Split Vietnamese text into sentences without breaking on:
    - Decimal numbers: "1.200.000 VNĐ"
    - Common abbreviations: "TP.", "Dr.", "No.", "ST.", v.v.
    - Ellipsis: "..."

    Strategy: only split on [.!?] that is followed by whitespace AND an uppercase letter
    or a Vietnamese uppercase (À-Ỹ). This avoids splitting "50.000 VNĐ. Đây là..."
    vs keeping "Dr. Nguyễn" intact.
    """
    # Protect known patterns from being split
    # 1. Replace "..." with a placeholder
    text = text.replace("...", "⟨ellipsis⟩")
    # 2. Replace decimal separators: digit.digit → protect
    text = re.sub(r"(\d)\.(\d)", r"\1⟨dot⟩\2", text)
    # 3. Replace common abbreviations: word of 1-3 uppercase letters followed by dot
    text = re.sub(r"\b([A-ZĐÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂẮẶẦẨẪẤẬẺẼẸỀẾỆỈỊỎỌỒỐỔỖỘỚỜỞỠỢỤỦỪỨỬỮỰỲỴỶỸ]{1,3})\.", r"\1⟨abbr⟩", text)

    # Split only on sentence-ending punctuation followed by space + uppercase start
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-ZĐÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂẮẶẦẨẪẤẬẺẼẸỀẾỆỈỊỎỌỒỐỔỖỘỚỜỞỠỢỤỦỪỨỬỮỰỲỴỶỸ])', text)

    # Restore placeholders
    restored = []
    for s in sentences:
        s = s.replace("⟨ellipsis⟩", "...").replace("⟨dot⟩", ".").replace("⟨abbr⟩", ".")
        if s.strip():
            restored.append(s.strip())
    return restored


def _sanitize_generated_answer(text: str) -> str:
    """Normalize model output into concise, clean prose."""
    clean = text or ""

    # Remove model-generated citation footer; backend will append canonical footer later.
    clean = re.sub(
        r"(?ms)^---\s*\n📚\s*\*\*Nguồn tham khảo:\*\*[\s\S]*$",
        "",
        clean,
    ).strip()

    # Remove malformed citation list lines generated by model.
    clean = re.sub(r"(?m)^\s*-\s*\*\*\[[^\]]+\]\*\*.*$", "", clean)

    # Fix inline malformed citations like [ 1 VNĐ ] -> [1]
    clean = re.sub(r"\[\s*(\d+)\s*(?:VNĐ|VND)\s*\]", r"[\1]", clean, flags=re.IGNORECASE)

    # Normalize excess whitespace.
    clean = re.sub(r"\n{4,}", "\n\n", clean)
    clean = clean.strip()

    # Trim common dangling endings from truncated generations.
    clean = re.sub(r"(?:\s+(?:và|hoặc|cho|tại|với|là|:))\s*$", "", clean, flags=re.IGNORECASE)

    return clean


def _build_fallback_answer(context_blocks: list[str]) -> str:
    """Build a clean fallback when LLM synthesis fails."""
    if not context_blocks:
        return "Chưa tìm thấy dữ liệu phù hợp trong tài liệu hiện có; bạn vui lòng nêu rõ hơn điều kiện cần tra cứu."

    clean = re.sub(r'^\[\d+\]\s*', '', context_blocks[0]).strip()
    return f"Thông tin gần nhất trong tài liệu là: {clean}"


def _format_citations_footer(citations: list[dict[str, Any]]) -> str:
    """Format citations into a clean markdown footer."""
    if not citations:
        return ""

    cite_lines = ["---", "📚 **Nguồn tham khảo:**"]
    for c in citations:
        # Sanitize page: chỉ chấp nhận số hoặc "?"
        raw_page = c.get("page")
        try:
            page_str = str(int(raw_page)) if raw_page is not None else "?"
        except (ValueError, TypeError):
            page_str = "?"

        # Sanitize score: chỉ chấp nhận float hợp lệ 0–1
        raw_score = c.get("score")
        try:
            score_val = float(raw_score)
            score_str = f" — độ liên quan: {score_val:.3f}" if 0 < score_val <= 1 else ""
        except (ValueError, TypeError):
            score_str = ""

        headings = c.get("headings", [])
        headings_str = f" | mục: {headings[-1]}" if headings else ""

        cite_lines.append(
            f"- **[{c['index']}]** {c['file']} (Trang {page_str}){headings_str}{score_str}"
        )

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
        from qdrant_client import QdrantClient

        # 1. Setup embedding (cached singleton) + vector store
        Settings.embed_model = _get_hf_embed_model()
        Settings.llm = None
        qdrant = QdrantClient(url=os.getenv("QDRANT_URL", "http://qdrant:6333"))
        vector_store = QdrantVectorStore(client=qdrant, collection_name="port_knowledge")
        storage_ctx = StorageContext.from_defaults(vector_store=vector_store)
        index = VectorStoreIndex.from_vector_store(vector_store=vector_store, storage_context=storage_ctx)

        # 2. Retrieve top-k chunks, then filter by score threshold
        # Giữ top_k = 5 để context gọn và tập trung hơn.
        retriever = index.as_retriever(
            similarity_top_k=5,
            vector_store_kwargs={"filter": _build_qdrant_filter(user_id, department)},
        )
        all_nodes = list(retriever.retrieve(question))

        # Discard chunks below score threshold — avoids hallucination from irrelevant context
        top_nodes = [
            n for n in all_nodes
            if getattr(n, "score", 0.0) is not None and (getattr(n, "score", 0.0) or 0.0) >= RAG_SCORE_THRESHOLD
        ]
        if not top_nodes:
            logger.info(f"[RAG] No chunks above score threshold {RAG_SCORE_THRESHOLD} for session {session_id}")

        # 3. Build context + citations
        citations, context_blocks = _build_context_and_citations(top_nodes)
        context_text = "\n\n---\n\n".join(context_blocks).strip()
        logger.info(f"[RAG CONTEXT (Top K)]:\n{context_text}\n{'='*50}")

        # 4. Synthesize via LLM (with fallback)
        result_text = ""
        llm_error: str | None = None
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
                llm_error = str(e)
                logger.error(
                    f"[RAG] LLM synthesis FAILED for session={session_id} "
                    f"model={os.getenv('LLM_MODEL','?')} "
                    f"base={os.getenv('OPENAI_BASE_URL','?')} "
                    f"error={e}"
                )
        if not result_text:
            if llm_error:
                result_text = _build_fallback_answer([])
            else:
                result_text = _build_fallback_answer(context_blocks)

        logger.info(f"[RAG RAW LLM OUTPUT]:\n{result_text}\n{'='*50}")
        result_text = _sanitize_generated_answer(result_text)
        logger.info(f"[RAG AFTER SANITIZE]:\n{result_text}\n{'='*50}")
        result_text += _format_citations_footer(citations)

        # 5. Save via Backend API
        from src.core.http_client import get_http_client
        http_client = get_http_client(timeout=10.0)
        resp = http_client.post(
            f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages",
            json={"content": result_text, "role": "assistant"},
        )
        resp.raise_for_status()

        # 6. Store retrieved chunk IDs in message metadata for accurate feedback
        try:
            msg_id = resp.json().get("id")
            if msg_id and top_nodes:
                chunk_ids = []
                for n in top_nodes:
                    try:
                        node_id = n.node.node_id
                        if node_id:
                            chunk_ids.append(node_id)
                    except Exception:
                        pass
                if chunk_ids:
                    http_client.patch(
                        f"{BACKEND_INTERNAL_URL}/messages/{msg_id}/metadata",
                        json={"rag_chunk_ids": chunk_ids},
                    )
        except Exception as e:
            logger.warning(f"[RAG] Could not store chunk_ids in message metadata: {e}")

        logger.info(f"[RAG] Saved answer for session {session_id}")
        from .helpers import publish_task_complete
        publish_task_complete(session_id)
        return {"status": "success", "question": question, "citations": len(citations)}

    except Exception as exc:
        logger.exception(f"Error in RAG document search: {exc}")
        try:
            from src.core.http_client import get_http_client
            get_http_client(timeout=10.0).post(
                f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages",
                json={
                    "content": "Xin lỗi, hệ thống gặp sự cố khi tìm kiếm tài liệu. Vui lòng thử lại sau ạ.",
                    "role": "assistant",
                },
            )
        except Exception:
            pass
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
            logger.info(f"[feedback] Marked {downgraded} exact chunk(s) as low_quality via stored IDs")

        else:
            # Strategy B: fallback — embed the question (not the answer) to find source chunks.
            # Note: we embed msg_content (the bot answer); a better proxy would be the user
            # question, but we don't have it here without a DB join. This is still better
            # than the previous approach of embedding the answer with wrong intent.
            from src.core.http_client import get_http_client
            mem0_url = os.getenv("MEM0_URL", MEM0_DEFAULT_URL)
            client = get_http_client(timeout=30.0)
            resp = client.post(
                f"{mem0_url.rstrip('/')}/embed",
                json={"text": msg_content[:500]},
            )
            resp.raise_for_status()
            query_vector = resp.json()["vector"]

            matches = qdrant.query_points(
                collection_name="port_knowledge",
                query=query_vector,
                limit=3,
            ).points

            for point in matches:
                if point.score and point.score > 0.7:
                    qdrant.set_payload(
                        collection_name="port_knowledge",
                        payload={"quality": "low", "dislike_reason": reason or "unknown"},
                        points=[point.id],
                    )
                    downgraded += 1
                    logger.info(f"[feedback] Marked vector {point.id} as low_quality (fallback similarity)")

        return {"status": "ok", "action": "vectors_downgraded", "message_id": message_id, "downgraded": downgraded}

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

        # Truncate each message for the summary prompt (max 200 chars each)
        conversation = "\n".join(
            f"{r[0].upper()}: {r[1][:200]}{'...' if len(r[1]) > 200 else ''}"
            for r in rows
        )

        # 2. Call LLM to summarize
        openai_key = os.getenv("OPENAI_API_KEY", "")
        openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
        llm_model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")

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

        # 3. Store summary in session metadata — safe JSON serialization
        import json as _json
        patch_payload = _json.dumps({"summary": summary, "message_count_at_summary": msg_count})
        db_pool.execute_query(
            "UPDATE chat_sessions SET metadata = "
            "COALESCE(metadata, '{}'::json)::jsonb || CAST(:patch AS jsonb) "
            "WHERE id = :sid",
            {"sid": session_id, "patch": patch_payload}
        )

        return {"status": "ok", "session_id": session_id, "summary_length": len(summary)}

    except Exception as exc:
        logger.exception(f"Error summarizing session: {exc}")
        return {"status": "error", "message": str(exc)}
