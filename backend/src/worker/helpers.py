"""
Shared helper functions for Celery tasks.

These are NOT tasks themselves — just utility functions used by
chat_tasks, data_tasks, and media_tasks.
"""
import base64
from datetime import datetime, timezone
import json
import logging
import os
import re
from typing import Any

import redis as sync_redis

logger = logging.getLogger(__name__)
perf_logger = logging.getLogger("chatsnp.perf")

UPLOAD_STAGES = ["preflight", "parse", "chunk", "embed", "upsert"]
STAGE_WEIGHTS = {
    "preflight": 5,
    "parse": 25,
    "chunk": 15,
    "embed": 35,
    "upsert": 20,
}

def _extract_text_from_image(file_path: repr) -> str:
    """
    Sử dụng OpenAI Vision API (hoặc tương đương qua LiteLLM) để trích xuất 
    mô tả chi tiết từ hình ảnh (.jpg, .png).
    """
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.getenv("LLM_MODEL", "gpt-4o-mini")

    if not api_key:
        logger.warning("[vlm] OPENAI_API_KEY is missing. Cannot process image.")
        return "Không thể phân tích ảnh do thiếu API Key."

    try:
        with open(file_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
        
        _, ext = os.path.splitext(file_path.lower())
        mime_type = "image/jpeg" if ext in [".jpg", ".jpeg"] else "image/png"
        
        payload = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            "text": "Hãy miêu tả chi tiết bức ảnh này bằng tiếng Việt. Chú ý đọc và trích xuất toàn bộ chữ viết, biểu đồ, sơ đồ có trong ảnh. Đừng bỏ sót thông tin."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{encoded_string}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 1500
        }

        from src.core.http_client import get_http_client
        headers = {"Authorization": f"Bearer {api_key}"}
        resp = get_http_client(timeout=60.0).post(f"{base_url}/chat/completions", json=payload, headers=headers)
        resp.raise_for_status()
        result = resp.json()
        description = result["choices"][0]["message"]["content"]
        logger.info(f"[vlm] Khai thác thành công mô tả ảnh ({len(description)} chars).")
        return description
    except Exception as exc:
        logger.exception(f"[vlm] Failed to process image {file_path}: {exc}")
        return f"Lỗi xử lý ảnh: {exc}"


def _llm_enrich_table(markdown_table: str) -> str:
    """
    Sử dụng LLM (Text-to-Text) để tóm tắt ý nghĩa của bảng Markdown.
    Dùng cái này thay cho bảng gốc khi embedding sẽ tăng độ chính xác tìm kiếm.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.getenv("LLM_MODEL", "gpt-4o-mini")

    if not api_key or len(markdown_table) < 50:
        return markdown_table

    try:
        from src.core.http_client import get_http_client
        headers = {"Authorization": f"Bearer {api_key}"}
        
        # Prompt "Vạn năng" - Tự thích nghi với loại bảng
        system_prompt = (
            "Bạn là trợ lý xử lý dữ liệu cho hệ thống RAG. Nhiệm vụ: Chuyển đổi bảng Markdown sau thành văn bản tự nhiên (tiếng Việt) để phục vụ tìm kiếm."
            "\n1. Nếu là Bảng Danh Sách (Giá, Thông số kỹ thuật, Nhân sự...): Hãy viết lại chi tiết từng dòng thành câu (VD: 'Mục A có giá X', 'Ông B giữ chức vụ Y')."
            "\n2. Nếu là Bảng Tổng Hợp (Báo cáo tài chính, Thống kê...): Hãy tóm tắt các xu hướng chính và nêu bật các con số tổng quan quan trọng nhất."
            "\n3. Yêu cầu bắt buộc: Giữ nguyên chính xác mọi con số, tên riêng và đơn vị tính. Không được bịa đặt thông tin không có trong bảng."
        )

        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": markdown_table[:4000]} # Limit context
            ],
            "temperature": 0.0, # Nhiệt độ 0 để đảm bảo tính chính xác tuyệt đối
            "max_tokens": 500
        }
        # Timeout ngắn để không làm chậm pipeline quá nhiều
        resp = get_http_client(timeout=20.0).post(f"{base_url}/chat/completions", json=payload, headers=headers)
        if resp.status_code == 200:
            summary = resp.json()["choices"][0]["message"]["content"].strip()
            # Lưu kết quả làm giàu + Bảng gốc (để tham chiếu nếu cần hiển thị)
            return f"{summary}\n\n[Cấu trúc gốc để tham khảo:\n{markdown_table}\n]"
        return markdown_table
    except Exception as e:
        logger.warning(f"[enrich] Failed to summarize table: {e}")
        return markdown_table

def publish_task_complete(session_id: str, event: str = "message_ready") -> None:
    """
    Publish a Redis Pub/Sub event when a Celery task finishes.
    The SSE endpoint subscribes to `session:{session_id}` and forwards
    these events to the frontend in real-time.
    """
    try:
        redis_url = os.getenv("REDIS_URL", os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0"))
        r = sync_redis.from_url(redis_url)
        r.publish(
            f"session:{session_id}",
            json.dumps({"event": event, "session_id": session_id}),
        )
        logger.info(f"[pubsub] Published '{event}' for session {session_id}")
    except Exception as exc:
        logger.warning(f"[pubsub] Failed to publish event: {exc}")


def publish_document_event(document_id: str, payload: dict[str, Any]) -> None:
    """Publish upload progress/status to Redis Pub/Sub for SSE consumers."""
    try:
        redis_url = os.getenv("REDIS_URL", os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0"))
        r = sync_redis.from_url(redis_url)
        r.publish(f"document:{document_id}", json.dumps(payload))
        logger.debug(f"[pubsub] Published document event for {document_id}: {payload.get('type')}")
    except Exception as exc:
        logger.warning(f"[pubsub] Failed to publish document event: {exc}")


def _process_tables_in_text(text: str) -> str:
    """
    Tìm các bảng Markdown trong văn bản và "làm giàu" chúng bằng LLM.
    Thay thế logic cũ (_truncate_tables) vốn xóa bỏ dữ liệu.
    """
    table_regex = re.compile(r'((?:^\s*\|.*\|\s*(?:\n|$)){3,})', re.MULTILINE)

    def enrich_table_match(match: re.Match) -> str:
        block = match.group(1)
        lines = [l.strip() for l in block.strip().split('\n') if l.strip()]
        
        # Nếu bảng nhỏ (< 4 dòng), giữ nguyên, không cần gọi LLM tốn tiền
        if len(lines) < 4:
            return block

        # Gọi LLM để biến bảng thành văn bản ngữ nghĩa
        return _llm_enrich_table(block)

    return table_regex.sub(enrich_table_match, text)


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
    
    Table handling: Uses LLM to enrich tables into semantic text 
    BEFORE chunking to ensure searchability of price lists.
    """
    separators = ["\n\n\n", "\n\n", "\n", ". ", ", ", " ", ""]

    original_text = text

    # Pre-process: Enrich tables (Biến bảng thành văn bản) thay vì cắt bỏ
    text = _process_tables_in_text(text)

    chunks: list[str] = []
    _recursive_split(text, separators, chunk_size, overlap, chunks)

    result: list[tuple[str, int]] = []
    
    # Track position in original text to estimate accurately despite truncation
    orig_char_pos = 0
    page_breaks = [m.start() for m in re.finditer(r"\f", original_text)]
    
    for chunk in chunks:
        # To map back to original text, use the first 30 chars of the chunk
        # (Table summaries won't match, but text around them will help anchor the position)
        anchor = chunk[:30]
        # Ignore custom table summaries in anchor search
        # Nếu chunk bắt đầu bằng kết quả enrichment, tìm anchor khác
        if "Cấu trúc gốc để tham khảo" in chunk:
             # Fallback tìm kiếm tương đối
             pass
                
        found_pos = original_text.find(anchor, max(0, orig_char_pos - 50))
        actual_pos = found_pos if found_pos != -1 else orig_char_pos
        
        page_num = 1
        
        # 1. Check for explicit <!-- Page X --> tags near the chunk in original text
        context_window = original_text[max(0, actual_pos - 1000):actual_pos + 1000]
        page_tag_match = re.search(r"<!--\s*Page\s*(\d+)\s*-->", context_window, re.IGNORECASE)
        
        if page_tag_match:
            page_num = int(page_tag_match.group(1))
        # 2. Check for form feeds (\f)
        elif page_breaks:
            for bp in page_breaks:
                if actual_pos >= bp:
                    page_num += 1
        # 3. Estimate by literal character length from original document
        else:
            CHARS_PER_PAGE = 2500
            page_num = max(1, (actual_pos // CHARS_PER_PAGE) + 1)
            
        result.append((chunk.strip(), page_num))
        orig_char_pos = actual_pos + len(chunk) // 2  # Advance anchor

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
        from src.core.database_pool import db_pool

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
        if metadata is not None:
            existing = db_pool.execute_query_fetchone(
                "SELECT metadata FROM documents WHERE id = :doc_id",
                {"doc_id": document_id},
            )
            existing_metadata = existing[0] if existing and existing[0] else {}
            if not isinstance(existing_metadata, dict):
                existing_metadata = {}
            merged_metadata = {**existing_metadata, **metadata}
            updates.append("metadata = :metadata")
            params["metadata"] = json.dumps(merged_metadata)

        sql = f"UPDATE documents SET {', '.join(updates)} WHERE id = :doc_id"
        db_pool.execute_query(sql, params)

        logger.info(f"[db] Updated document {document_id} → status={status}")
    except Exception as e:
        logger.error(f"[db] Failed to update document status: {e}")


def update_document_progress(
    document_id: str,
    stage: str,
    elapsed_ms: float,
    chunks_so_far: int = 0,
    details: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Persist document progress under metadata.progress and return the payload."""
    from src.core.database_pool import db_pool

    stage_key = stage if stage in STAGE_WEIGHTS else "parse"
    pct = 0
    for current_stage in UPLOAD_STAGES:
        pct += STAGE_WEIGHTS[current_stage]
        if current_stage == stage_key:
            break

    progress = {
        "stage": stage_key,
        "pct": min(100, pct),
        "elapsed_ms": round(elapsed_ms, 1),
        "chunks_so_far": chunks_so_far,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    if details:
        progress["details"] = details

    existing = db_pool.execute_query_fetchone(
        "SELECT metadata FROM documents WHERE id = :doc_id",
        {"doc_id": document_id},
    )
    existing_metadata = existing[0] if existing and existing[0] else {}
    if not isinstance(existing_metadata, dict):
        existing_metadata = {}
    existing_metadata["progress"] = progress

    db_pool.execute_query(
        "UPDATE documents SET metadata = :metadata, updated_at = NOW() WHERE id = :doc_id",
        {
            "doc_id": document_id,
            "metadata": json.dumps(existing_metadata),
        },
    )
    return progress


def log_stage(
    document_id: str,
    stage: str,
    elapsed_ms: float,
    extra: dict[str, Any] | None = None,
) -> None:
    """Emit a structured timing log for upload pipeline stages."""
    payload: dict[str, Any] = {
        "event": "stage_timing",
        "document_id": document_id,
        "stage": stage,
        "elapsed_ms": round(elapsed_ms, 1),
    }
    if extra:
        payload.update(extra)
    perf_logger.info(json.dumps(payload, ensure_ascii=False))
