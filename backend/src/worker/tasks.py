"""
Celery task definitions for ChatSNP.

3 Queues:
  - chat_priority : Real-time chat processing (embedding, memory)
  - data_batch    : SQL queries (Vanna + LangGraph verification)
  - media_process : Charts (Lida), Documents (Docling), Voice (Edge-TTS)
"""
import logging
from typing import Any

from .celery_app import celery_app

logger = logging.getLogger(__name__)


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


# =============================================================================
# 🟠 QUEUE: data_batch — SQL & Data Sync
# =============================================================================

@celery_app.task(name="src.worker.tasks.run_sql_query", bind=True, max_retries=2)
def run_sql_query(
    self,
    question: str,
    user_id: str | None = None,
) -> dict[str, Any]:
    """
    Vanna SQL Agent + LangGraph verification loop.
    1. Vanna sinh SQL từ câu hỏi tự nhiên
    2. LangGraph kiểm tra SQL (no DROP/DELETE/ALTER, valid schema)
    3. Nếu sai → loop lại Vanna (max 3 lần)
    4. Execute SQL → trả kết quả
    """
    logger.info(f"[data_batch] SQL query for: {question[:50]}...")
    try:
        # TODO: Phase 3 — implement Vanna + LangGraph loop
        return {"status": "ok", "question": question, "sql": None, "result": None}
    except Exception as exc:
        logger.exception(f"Error in SQL query: {exc}")
        raise self.retry(exc=exc, countdown=5)


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
) -> dict[str, Any]:
    """
    Docling: Trích xuất nội dung từ PDF/DOCX.
    Output: structured text + metadata.
    """
    logger.info(f"[media_process] Processing document: {file_path}")
    try:
        # TODO: Phase 3 — implement Docling document extraction
        return {"status": "ok", "file_path": file_path, "content": None}
    except Exception as exc:
        logger.exception(f"Error processing document: {exc}")
        raise self.retry(exc=exc, countdown=3)


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
