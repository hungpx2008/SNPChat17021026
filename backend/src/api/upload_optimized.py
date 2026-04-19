"""
Upload API — OPTIMIZED VERSION với performance improvements.

Improvements:
1. Async file I/O (aiofiles)
2. File size validation
3. Streaming upload support
4. Better error handling
"""
from __future__ import annotations

import logging
import os
import mimetypes
import unicodedata
import json
import asyncio

logger = logging.getLogger(__name__)
from typing import Any, Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.deps import get_db_session
from src.core.redis_client import get_redis
from src.models.models import Document
from src.schemas.schemas import DocumentSchema, DocumentUploadResponse

router = APIRouter(prefix="/upload", tags=["upload"])

UPLOAD_DIR = "/app/media/uploads"
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB limit

ALLOWED_EXTENSIONS = {
    ".pdf", ".docx", ".doc", ".xlsx", ".xls",
    ".pptx", ".ppt", ".md", ".txt", ".csv",
    ".jpg", ".jpeg", ".png",
    ".mp3", ".wav", ".m4a", ".aac",
}
MEDIA_AUDIO_EXTENSIONS = {".mp3", ".wav", ".m4a", ".aac"}


def _validate_extension(filename: str) -> str:
    """Validate and return the file extension."""
    _, ext = os.path.splitext(filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{ext}' not supported. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )
    return ext


def _delete_qdrant_chunks(document_id: str) -> None:
    """Delete all Qdrant chunks for a document by document_id."""
    try:
        from qdrant_client.http import models as qmodels
        from src.core.qdrant_setup import get_qdrant_client
        client = get_qdrant_client()
        client.delete(
            collection_name="port_knowledge",
            points_selector=qmodels.FilterSelector(
                filter=qmodels.Filter(
                    must=[qmodels.FieldCondition(
                        key="document_id",
                        match=qmodels.MatchValue(value=document_id),
                    )]
                )
            ),
        )
        logger.info(f"[qdrant] Deleted chunks with document_id={document_id}")
    except Exception as e:
        logger.error(f"[qdrant] FAILED to delete chunks for document_id={document_id}: {e}")


def _delete_qdrant_chunks_by_filename(filename: str, user_id: str | None = None) -> None:
    """Delete ALL Qdrant chunks matching a source_file (and optionally user_id)."""
    try:
        from qdrant_client.http import models as qmodels
        from src.core.qdrant_setup import get_qdrant_client
        client = get_qdrant_client()
        must_conditions: list = [
            qmodels.FieldCondition(key="source_file", match=qmodels.MatchValue(value=filename))
        ]
        if user_id:
            must_conditions.append(
                qmodels.FieldCondition(key="user_id", match=qmodels.MatchValue(value=user_id))
            )
        client.delete(
            collection_name="port_knowledge",
            points_selector=qmodels.FilterSelector(filter=qmodels.Filter(must=must_conditions)),
        )
        logger.info(f"[qdrant] Deleted chunks with source_file={filename}, user_id={user_id}")
    except Exception as e:
        logger.error(f"[qdrant] FAILED to delete chunks by filename={filename}: {e}")


async def _handle_duplicate(
    db: AsyncSession,
    filename: str,
    user_id: str,
    overwrite: bool,
) -> None:
    """
    Check for duplicate filename. Raises 409 if duplicate exists and overwrite=False.
    Cleans up old records and vectors if overwrite=True.
    """
    result = await db.execute(
        select(Document)
        .where(Document.user_id == user_id, Document.filename == filename)
        .order_by(Document.created_at.desc())
    )
    existing_docs = result.scalars().all()

    if not existing_docs:
        return

    if not overwrite:
        first_doc = existing_docs[0]
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "message": f"Tài liệu '{filename}' đã tồn tại. Bạn có muốn ghi đè không?",
                "existing_document_id": str(first_doc.id),
                "existing_filename": first_doc.filename,
                "existing_status": first_doc.status,
            },
        )

    # overwrite=True: clean up old vectors + DB records
    _delete_qdrant_chunks_by_filename(filename, user_id)
    for old_doc in existing_docs:
        if old_doc.file_path and os.path.exists(old_doc.file_path):
            os.remove(old_doc.file_path)
        await db.delete(old_doc)
    await db.flush()


@router.post("", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None),
    overwrite: bool = Form(False),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """
    Upload a document for processing (OPTIMIZED).

    Improvements:
    - Async file I/O
    - File size validation
    - Better error handling
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    # ⚡ NEW: File size validation
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File quá lớn ({file_size / 1024 / 1024:.1f}MB). Tối đa {MAX_FILE_SIZE / 1024 / 1024:.0f}MB.",
        )

    ext = _validate_extension(file.filename)
    normalized_filename = unicodedata.normalize("NFC", file.filename)

    if user_id:
        await _handle_duplicate(db, normalized_filename, user_id, overwrite)

    # Save file to disk
    doc_id = uuid4()
    safe_filename = f"{doc_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # ⚡ IMPROVED: Async file I/O
    try:
        import aiofiles
        async with aiofiles.open(file_path, "wb") as buffer:
            content = await file.read()
            await buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    # Create DB record
    document = Document(
        id=doc_id,
        user_id=user_id,
        filename=file.filename,
        file_path=file_path,
        status="processing",
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)

    # Dispatch Celery task based on file type
    if ext in MEDIA_AUDIO_EXTENSIONS:
        from src.worker.tasks import transcribe_audio
        transcribe_audio.delay(
            file_path=file_path,
            user_id=user_id,
            original_filename=file.filename,
            document_id=str(doc_id),
        )
    else:
        from src.worker.tasks import process_document
        process_document.delay(
            file_path=file_path,
            user_id=user_id,
            original_filename=file.filename,
            document_id=str(doc_id),
        )

    return DocumentUploadResponse(
        document_id=doc_id,
        filename=file.filename,
        status="processing",
        message="Tài liệu đã được tải lên và đang xử lý qua Docling.",
    )


@router.get("/{document_id}/status", response_model=DocumentSchema)
async def get_document_status(
    document_id: UUID,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Check the processing status of an uploaded document."""
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.get("/{document_id}/stream")
async def stream_document_progress(
    document_id: UUID,
    user_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """SSE stream for document upload progress updates."""
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    if user_id and document.user_id and document.user_id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    async def event_generator():
        redis = get_redis()
        pubsub = redis.pubsub()
        await pubsub.subscribe(f"document:{document_id}")

        try:
            if document.meta and document.meta.get("progress"):
                initial = {
                    "type": "progress",
                    "document_id": str(document_id),
                    **document.meta.get("progress", {}),
                }
                yield f"data: {json.dumps(initial)}\n\n"
            elif document.status in {"ready", "error"}:
                initial = {
                    "type": "done" if document.status == "ready" else "error",
                    "document_id": str(document_id),
                    "status": document.status,
                    "message": document.error_message or "",
                }
                yield f"data: {json.dumps(initial)}\n\n"
                return

            deadline = asyncio.get_running_loop().time() + 120
            while asyncio.get_running_loop().time() < deadline:
                message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                if not message:
                    await asyncio.sleep(0.2)
                    continue
                data = message.get("data")
                if not data:
                    continue
                yield f"data: {data}\n\n"
                parsed = json.loads(data)
                if parsed.get("type") in {"done", "error"}:
                    break
            else:
                yield f"data: {json.dumps({'type': 'timeout', 'document_id': str(document_id)})}\n\n"
        finally:
            await pubsub.unsubscribe(f"document:{document_id}")
            await pubsub.close()

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.delete("/{document_id}/cancel")
async def cancel_document(
    document_id: UUID,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """
    Cancel/delete a document:
    - Delete all Qdrant vectors (by document_id and by filename)
    - Delete uploaded file from disk
    - Delete DB record
    """
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    _delete_qdrant_chunks(str(document_id))
    _delete_qdrant_chunks_by_filename(document.filename, document.user_id)

    if document.file_path and os.path.exists(document.file_path):
        os.remove(document.file_path)

    await db.delete(document)
    await db.commit()

    return {
        "status": "cancelled",
        "document_id": str(document_id),
        "message": "Tài liệu đã bị xóa và toàn bộ chunks đã được dọn sạch.",
    }
