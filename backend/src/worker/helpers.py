"""
Shared helper functions for Celery tasks.

These are NOT tasks themselves — just utility functions used by
chat_tasks, data_tasks, and media_tasks.
"""
import json
import logging
import os
import re
from typing import Any

import redis as sync_redis

logger = logging.getLogger(__name__)


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


def _truncate_tables(text: str) -> str:
    """
    Replace markdown tables with concise summaries.
    "| Col1 | Col2 |\n|---|---|\n| a | b |\n| c | d |"
    → "Bảng 2 cột: [Col1, Col2]. 2 dòng dữ liệu."
    """
    table_regex = re.compile(r'((?:^\s*\|.*\|\s*(?:\n|$)){3,})', re.MULTILINE)

    def summarize_table(match: re.Match) -> str:
        block = match.group(1)
        lines = [l.strip() for l in block.strip().split('\n') if l.strip()]
        if len(lines) < 2:
            return block

        # Extract headers from first line
        header_line = lines[0]
        headers = [c.strip() for c in header_line.strip('|').split('|') if c.strip()]

        # Check if second line is separator (|---|---|)
        sep_line = lines[1] if len(lines) > 1 else ""
        is_table = bool(re.match(r'^\s*\|[\s\-:]+\|', sep_line))
        if not is_table:
            return block

        data_rows = len(lines) - 2  # Exclude header + separator
        col_list = ", ".join(headers[:6])
        if len(headers) > 6:
            col_list += f", ... (+{len(headers) - 6} cột)"

        return f"[Bảng {len(headers)} cột: {col_list}. {data_rows} dòng dữ liệu.]"

    return table_regex.sub(summarize_table, text)


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
    
    Table truncation: If a chunk contains a markdown table, the table
    is summarized as "Bảng N cột: [headers]. M dòng dữ liệu." to
    save vector DB space while preserving structure metadata.
    """
    separators = ["\n\n\n", "\n\n", "\n", ". ", ", ", " ", ""]

    # Pre-process: truncate markdown tables to summaries before chunking
    text = _truncate_tables(text)

    chunks: list[str] = []
    _recursive_split(text, separators, chunk_size, overlap, chunks)

    # Estimate page numbers from form-feed chars OR character position
    result: list[tuple[str, int]] = []
    char_pos = 0
    page_breaks = [m.start() for m in re.finditer(r"\f", text)]

    if page_breaks:
        # Real page breaks found (PDF) — use exact positions
        page_breaks = [0] + page_breaks
        for chunk in chunks:
            page_num = 1
            for i, bp in enumerate(page_breaks):
                if char_pos >= bp:
                    page_num = i + 1
            result.append((chunk.strip(), page_num))
            found_pos = text.find(chunk, max(0, char_pos - 10))
            char_pos = (found_pos if found_pos != -1 else char_pos) + len(chunk)
    else:
        # No form-feeds (DOCX, TXT) — estimate ~2500 chars per page
        CHARS_PER_PAGE = 2500
        for chunk in chunks:
            found_pos = text.find(chunk, max(0, char_pos - 10))
            actual_pos = found_pos if found_pos != -1 else char_pos
            page_num = max(1, (actual_pos // CHARS_PER_PAGE) + 1)
            result.append((chunk.strip(), page_num))
            char_pos = actual_pos + len(chunk)

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
