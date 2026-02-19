"""
Celery task definitions for ChatSNP.

3 Queues:
  - chat_priority : Real-time chat processing (embedding, memory, RAG search)
  - data_batch    : SQL queries (Vanna + LangGraph verification)
  - media_process : Charts (Lida), Documents (Docling/Kreuzberg), Voice (Edge-TTS)
"""
import logging
import os
import re
from typing import Any
from uuid import uuid4

from .celery_app import celery_app

logger = logging.getLogger(__name__)

# Internal backend URL for saving messages via API
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
    Formerly: ChatService._process_message_background (chunk_and_store part)
    """
    logger.info(f"[chat_priority] Processing message {message_id} for session {session_id}")
    try:
        # TODO: Phase 2 — migrate logic từ chat_service._chunk_and_store
        # 1. Chunk text
        # 2. Call Mem0 /embed endpoint
        # 3. Store vectors in Qdrant
        return {"status": "ok", "message_id": message_id}
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
    Formerly: ChatService._process_message_background (mem0 store part)
    """
    logger.info(f"[chat_priority] Storing memory for user {user_id}")
    try:
        # TODO: Phase 2 — migrate logic: POST to Mem0 /memories
        return {"status": "ok", "user_id": user_id}
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
    2. Search Qdrant collection "port_knowledge"
    3. Build context + citations
    4. Call LLM for synthesized answer
    5. Save response via API
    """
    logger.info(f"[chat_priority] RAG search for session {session_id}: {question[:50]}...")
    try:
        import httpx

        mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")

        # 1. Embed the question
        with httpx.Client(timeout=30.0) as client:
            embed_resp = client.post(
                f"{mem0_url.rstrip('/')}/embed",
                json={"text": question},
            )
            embed_resp.raise_for_status()
            query_vector = embed_resp.json()["vector"]

        # 2. Search Qdrant "port_knowledge"
        from src.core.qdrant_setup import search_vectors
        results = search_vectors(
            collection="port_knowledge",
            vector=query_vector,
            limit=5,
            filters={"user_id": user_id} if user_id else None,
        )

        if not results:
            result_text = "Tôi không tìm thấy thông tin liên quan trong các tài liệu đã upload. Vui lòng upload tài liệu trước."
        else:
            # 3. Build context with citations
            context_parts = []
            citations = []
            for i, point in enumerate(results):
                payload = point.payload or {}
                text = payload.get("text", "")
                source = payload.get("source_file", "Unknown")
                page = payload.get("page_number", "?")
                score = point.score or 0.0

                context_parts.append(f"[Đoạn {i+1}] (Nguồn: {source}, Trang {page}):\n{text}")
                citations.append(f"**[Nguồn: {source}, Trang {page}]** (điểm: {score:.2f})")

            context = "\n\n---\n\n".join(context_parts)
            citation_block = "\n".join(citations)

            # 4. Call LLM for synthesized answer
            openai_key = os.getenv("OPENAI_API_KEY", "")
            openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
            llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")

            system_prompt = (
                "Bạn là trợ lý AI chuyên ngành Cảng biển. Dựa vào ngữ cảnh tài liệu được cung cấp, "
                "hãy trả lời câu hỏi một cách chính xác và đầy đủ.\n\n"
                "QUY TẮC QUAN TRỌNG:\n"
                "- Chỉ trả lời dựa trên thông tin trong ngữ cảnh.\n"
                "- Cuối câu trả lời, PHẢI ghi trích dẫn in đậm: **[Nguồn: tên file, Trang X]**\n"
                "- Nếu thông tin từ bảng biểu, giữ nguyên format bảng.\n"
                "- Nếu không tìm thấy thông tin, nói rõ là không có trong tài liệu."
            )

            user_prompt = f"Ngữ cảnh tài liệu:\n\n{context}\n\n---\n\nCâu hỏi: {question}"

            with httpx.Client(timeout=60.0) as client:
                llm_resp = client.post(
                    f"{openai_base.rstrip('/')}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {openai_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": llm_model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                        "temperature": 0.3,
                        "max_tokens": 2000,
                    },
                )
                llm_resp.raise_for_status()
                llm_data = llm_resp.json()
                answer = llm_data["choices"][0]["message"]["content"]

            result_text = f"{answer}\n\n---\n📄 **Trích dẫn:**\n{citation_block}"

        # 5. Save result via Backend API
        with httpx.Client(timeout=10.0) as client:
            api_url = f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages"
            resp = client.post(
                api_url,
                json={"content": result_text, "role": "assistant"},
            )
            resp.raise_for_status()
            logger.info(f"[RAG] Saved answer for session {session_id}")

        return {"status": "success", "question": question, "sources": len(results) if results else 0}

    except Exception as exc:
        logger.exception(f"Error in RAG document search: {exc}")
        # Try to save error message
        try:
            import httpx
            with httpx.Client(timeout=10.0) as client:
                client.post(
                    f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages",
                    json={
                        "content": f"Xin lỗi, tôi gặp lỗi khi tìm kiếm tài liệu: {exc}",
                        "role": "assistant",
                    },
                )
        except Exception:
            pass
        return {"status": "error", "message": str(exc)}


# =============================================================================
# 🟠 QUEUE: data_batch — SQL & Data Sync
# =============================================================================

@celery_app.task(name="src.worker.tasks.run_sql_query", bind=True, max_retries=2)
def run_sql_query(
    self,
    question: str,
    session_id: str,
    user_id: str | None = None,
) -> dict[str, Any]:
    """
    Vanna SQL Agent + LangGraph verification loop.
    1. Vanna sinh SQL từ câu hỏi tự nhiên
    2. LangGraph kiểm tra SQL (no DROP/DELETE/ALTER, valid schema)
    3. Execute SQL → trả kết quả
    4. Save result to DB as assistant message
    """
    logger.info(f"[data_batch] SQL query for session {session_id}: {question[:50]}...")
    try:
        from src.core.vanna_setup import vn
        if not vn:
            return {"status": "error", "message": "Vanna not initialized"}

        # 1. Generate SQL
        sql = vn.generate_sql(question=question, allow_llm_to_see_data=True)
        if not sql:
            result_text = "Sorry, I could not generate SQL for that question."
        else:
            logger.info(f"Generated SQL: {sql}")

            # 2. Safety Check (Basic)
            forbidden = ["DROP", "DELETE", "ALTER", "TRUNCATE", "INSERT", "UPDATE", "GRANT", "REVOKE"]
            if any(word in sql.upper() for word in forbidden):
                 result_text = f"I cannot execute this SQL because it contains forbidden keywords: {sql}"
            else:
                # 3. Execute SQL
                try:
                    df = vn.run_sql(sql)
                    if df is None or df.empty:
                        result_text = f"Executed SQL:\n```sql\n{sql}\n```\n\nNo data returned."
                    else:
                        markdown = df.to_markdown()
                        result_text = f"Here is the data I found:\n\n```sql\n{sql}\n```\n\n{markdown}"
                except Exception as sql_err:
                    result_text = f"Error executing SQL:\n```sql\n{sql}\n```\n\nError: {sql_err}"

        # 4. Save result via API
        import httpx
        try:
            api_url = f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages"
            payload = {
                "content": result_text,
                "role": "assistant"
            }
            with httpx.Client() as client:
                resp = client.post(api_url, json=payload, timeout=10.0)
                resp.raise_for_status()
                logger.info(f"Saved message via API: {resp.status_code}")
                
        except Exception as e:
            logger.error(f"Failed to save message via API: {e}")
            return {"status": "error", "message": str(e)}

        return {
            "status": "success",
            "question": question,
            "result_text": result_text
        }

    except Exception as exc:
        logger.exception(f"Error in SQL query: {exc}")
        return {"status": "error", "message": str(exc)}


@celery_app.task(name="src.worker.tasks.sync_data")
def sync_data(source: str, target: str, **kwargs) -> dict[str, Any]:
    """Đồng bộ dữ liệu giữa các nguồn."""
    logger.info(f"[data_batch] Syncing {source} → {target}")
    # TODO: Phase 3 — implement data sync logic
    return {"status": "ok", "source": source, "target": target}


# =============================================================================
# 🔵 QUEUE: media_process — Charts, Documents, TTS
# =============================================================================

@celery_app.task(name="src.worker.tasks.generate_chart", bind=True, max_retries=2)
def generate_chart(
    self,
    query: str,
    data: list[dict] | None = None,
    chart_type: str = "auto",
) -> dict[str, Any]:
    """
    Lida: Tự động sinh biểu đồ từ query + data.
    Output: path tới file PNG/SVG trong shared media volume.
    """
    logger.info(f"[media_process] Generating chart for: {query[:50]}...")
    try:
        # TODO: Phase 3 — implement Lida chart generation
        # output_path = "/app/media/charts/{uuid}.png"
        return {"status": "ok", "chart_path": None}
    except Exception as exc:
        logger.exception(f"Error generating chart: {exc}")
        raise self.retry(exc=exc, countdown=3)


@celery_app.task(name="src.worker.tasks.process_document", bind=True, max_retries=2)
def process_document(
    self,
    file_path: str,
    user_id: str | None = None,
    original_filename: str | None = None,
    document_id: str | None = None,
    force_deep_scan: bool = False,
) -> dict[str, Any]:
    """
    Hybrid Knowledge Engine: Kreuzberg (fast) → Docling (deep) fallback.
    1. Try Kreuzberg for fast text extraction
    2. If quality is low or tables detected → fall back to Docling
    3. Smart chunk with RecursiveCharacterTextSplitter
    4. Embed via Mem0 + upsert to Qdrant "port_knowledge"
    5. Update document status in PostgreSQL
    """
    filename = original_filename or os.path.basename(file_path)
    logger.info(f"[media_process] Processing document: {filename} (force_deep={force_deep_scan})")

    extractor_used = "kreuzberg"
    extracted_text = ""
    page_count = 0
    table_count = 0

    try:
        # ----------------------------------------------------------------
        # STEP 1: Extraction — Kreuzberg fast path (unless forced deep)
        # ----------------------------------------------------------------
        if not force_deep_scan:
            from src.services.kreuzberg_service import extract_text_sync
            kreuz_result = extract_text_sync(file_path)
            extracted_text = kreuz_result.text
            page_count = kreuz_result.page_count
            quality = kreuz_result.quality_score
            has_tables = kreuz_result.has_tables

            logger.info(
                f"[kreuzberg] Result: {len(extracted_text)} chars, "
                f"quality={quality:.2f}, tables={has_tables}"
            )

            # Decide if Docling fallback is needed
            needs_deep = force_deep_scan or has_tables or quality < 0.7
        else:
            needs_deep = True

        # ----------------------------------------------------------------
        # STEP 2: Docling deep path (if needed)
        # ----------------------------------------------------------------
        if needs_deep:
            logger.info(f"[docling] Falling back to deep processing for {filename}")
            extractor_used = "docling"
            try:
                from src.services.docling_service import process_document_deep
                deep_result = process_document_deep(file_path)
                if deep_result.markdown:
                    extracted_text = deep_result.markdown
                    page_count = deep_result.page_count
                    table_count = len(deep_result.tables)
                    logger.info(
                        f"[docling] Deep result: {len(extracted_text)} chars, "
                        f"{table_count} tables, {page_count} pages"
                    )
                elif not extracted_text:
                    # Both failed
                    raise ValueError("Both Kreuzberg and Docling failed to extract text")
                else:
                    # Docling failed but Kreuzberg had some text — use it
                    extractor_used = "kreuzberg"
                    logger.warning("[docling] Deep processing failed, using Kreuzberg result")
            except ImportError:
                logger.warning("[docling] Docling not available, using Kreuzberg result")
                if not extracted_text:
                    raise ValueError("Kreuzberg extraction was empty and Docling is not available")
                extractor_used = "kreuzberg"

        if not extracted_text.strip():
            raise ValueError(f"No text extracted from {filename}")

        # ----------------------------------------------------------------
        # STEP 3: Smart Chunking with RecursiveCharacterTextSplitter
        # ----------------------------------------------------------------
        chunks_with_pages = _smart_chunk(extracted_text, chunk_size=512, overlap=50)
        logger.info(f"[chunking] Created {len(chunks_with_pages)} chunks")

        # ----------------------------------------------------------------
        # STEP 4: Embed via Mem0 + Upsert to Qdrant "port_knowledge"
        # ----------------------------------------------------------------
        import httpx

        mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")
        vectors = []
        for chunk_text, _ in chunks_with_pages:
            with httpx.Client(timeout=30.0) as client:
                resp = client.post(
                    f"{mem0_url.rstrip('/')}/embed",
                    json={"text": chunk_text},
                )
                resp.raise_for_status()
                vectors.append(resp.json()["vector"])

        # Build payloads with metadata for citations
        payloads = []
        vector_ids = []
        for i, (chunk_text, page_num) in enumerate(chunks_with_pages):
            vid = str(uuid4())
            vector_ids.append(vid)
            payloads.append({
                "text": chunk_text,
                "source_file": filename,
                "page_number": page_num,
                "chunk_index": i,
                "user_id": user_id,
                "document_id": document_id,
                "type": "document_chunk",
                "extractor": extractor_used,
            })

        from src.core.qdrant_setup import upsert_vectors
        upsert_vectors("port_knowledge", payloads, vectors, ids=vector_ids)
        logger.info(f"[qdrant] Upserted {len(payloads)} vectors to port_knowledge")

        # ----------------------------------------------------------------
        # STEP 5: Update document status in PostgreSQL
        # ----------------------------------------------------------------
        if document_id:
            _update_document_status(
                document_id=document_id,
                status="ready",
                chunk_count=len(chunks_with_pages),
                extractor_used=extractor_used,
                metadata={
                    "page_count": page_count,
                    "table_count": table_count,
                    "char_count": len(extracted_text),
                },
            )

        return {
            "status": "success",
            "file_path": file_path,
            "filename": filename,
            "extractor": extractor_used,
            "chunks": len(chunks_with_pages),
            "pages": page_count,
            "tables": table_count,
        }

    except Exception as exc:
        logger.exception(f"Error processing document {filename}: {exc}")
        if document_id:
            _update_document_status(
                document_id=document_id,
                status="error",
                error_message=str(exc),
            )
        raise self.retry(exc=exc, countdown=5)


def _smart_chunk(
    text: str,
    chunk_size: int = 512,
    overlap: int = 50,
) -> list[tuple[str, int]]:
    """
    Smart chunking using RecursiveCharacterTextSplitter logic.
    Returns list of (chunk_text, estimated_page_number).
    
    Splits on: section breaks → paragraphs → sentences → words
    to avoid cutting mid-row in tables or mid-number in prices.
    """
    separators = ["\n\n\n", "\n\n", "\n", ". ", ", ", " ", ""]

    chunks: list[str] = []
    _recursive_split(text, separators, chunk_size, overlap, chunks)

    # Estimate page numbers from form-feed chars
    result: list[tuple[str, int]] = []
    char_pos = 0
    page_breaks = [0] + [m.start() for m in re.finditer(r"\f", text)]

    for chunk in chunks:
        # Find which page this chunk falls on
        page_num = 1
        for i, bp in enumerate(page_breaks):
            if char_pos >= bp:
                page_num = i + 1
        result.append((chunk.strip(), page_num))
        char_pos = text.find(chunk, char_pos)
        if char_pos == -1:
            char_pos += len(chunk)
        else:
            char_pos += len(chunk)

    return result


def _recursive_split(
    text: str,
    separators: list[str],
    chunk_size: int,
    overlap: int,
    result: list[str],
) -> None:
    """Recursive splitting — tries each separator in order."""
    if len(text) <= chunk_size:
        if text.strip():
            result.append(text)
        return

    if not separators:
        # Last resort: hard split
        for i in range(0, len(text), chunk_size - overlap):
            piece = text[i:i + chunk_size]
            if piece.strip():
                result.append(piece)
        return

    sep = separators[0]
    remaining_seps = separators[1:]

    if sep == "":
        # Split by characters
        for i in range(0, len(text), chunk_size - overlap):
            piece = text[i:i + chunk_size]
            if piece.strip():
                result.append(piece)
        return

    parts = text.split(sep)

    current = ""
    for part in parts:
        candidate = (current + sep + part) if current else part
        if len(candidate) <= chunk_size:
            current = candidate
        else:
            if current.strip():
                if len(current) <= chunk_size:
                    result.append(current)
                else:
                    _recursive_split(current, remaining_seps, chunk_size, overlap, result)
            current = part

    if current.strip():
        if len(current) <= chunk_size:
            result.append(current)
        else:
            _recursive_split(current, remaining_seps, chunk_size, overlap, result)


def _update_document_status(
    document_id: str,
    status: str,
    chunk_count: int = 0,
    extractor_used: str | None = None,
    error_message: str | None = None,
    metadata: dict | None = None,
) -> None:
    """Update document status in PostgreSQL (sync, for Celery)."""
    try:
        from sqlalchemy import create_engine, text
        db_url = os.getenv("DATABASE_URL", "")
        # Convert async URL to sync
        sync_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
        engine = create_engine(sync_url)

        updates = ["status = :status", "updated_at = NOW()"]
        params: dict[str, Any] = {"doc_id": document_id, "status": status}

        if chunk_count:
            updates.append("chunk_count = :chunk_count")
            params["chunk_count"] = chunk_count
        if extractor_used:
            updates.append("extractor_used = :extractor_used")
            params["extractor_used"] = extractor_used
        if error_message:
            updates.append("error_message = :error_message")
            params["error_message"] = error_message

        sql = f"UPDATE documents SET {', '.join(updates)} WHERE id = :doc_id"
        with engine.connect() as conn:
            conn.execute(text(sql), params)
            conn.commit()

        logger.info(f"[db] Updated document {document_id} → status={status}")
    except Exception as e:
        logger.error(f"[db] Failed to update document status: {e}")


@celery_app.task(name="src.worker.tasks.text_to_speech", bind=True, max_retries=2)
def text_to_speech(
    self,
    text: str,
    voice: str = "vi-VN-HoaiMyNeural",
    output_format: str = "mp3",
) -> dict[str, Any]:
    """
    Edge-TTS: Chuyển văn bản thành giọng nói tiếng Việt.
    Output: path tới file MP3 trong shared media volume.
    """
    logger.info(f"[media_process] TTS for: {text[:50]}...")
    try:
        # TODO: Phase 3 — implement Edge-TTS
        # output_path = "/app/media/audio/{uuid}.mp3"
        return {"status": "ok", "audio_path": None}
    except Exception as exc:
        logger.exception(f"Error in TTS: {exc}")
        raise self.retry(exc=exc, countdown=3)
