"""
Upload API — File upload and document management endpoints.

Simplified pipeline: all documents → Docling (single engine).
No Phase 1/2 split, no user engine choice, no Kreuzberg.
"""
from __future__ import annotations

import logging
import os
import shutil
import mimetypes
import unicodedata

logger = logging.getLogger(__name__)
from typing import Any, Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.deps import get_db_session
from src.models.models import Document
from src.schemas.schemas import DocumentSchema, DocumentUploadResponse

router = APIRouter(prefix="/upload", tags=["upload"])

UPLOAD_DIR = "/app/media/uploads"

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
    Upload a document for processing.

    All documents are processed through Docling (single pipeline).
    Status goes directly to 'processing' → 'ready' (or 'error').
    No user engine choice required.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = _validate_extension(file.filename)
    normalized_filename = unicodedata.normalize("NFC", file.filename)

    if user_id:
        await _handle_duplicate(db, normalized_filename, user_id, overwrite)

    # Save file to disk
    doc_id = uuid4()
    safe_filename = f"{doc_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
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


@router.get("/{document_id}/download")
async def download_document(
    document_id: UUID,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Preview/open the uploaded document file inline in browser."""
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    target_path = document.file_path
    target_filename = document.filename

    # Use preview PDF if available (e.g. PPTX converted to PDF)
    if document.meta and document.meta.get("preview_pdf_path"):
        preview_path = document.meta.get("preview_pdf_path")
        if os.path.exists(preview_path):
            target_path = preview_path
            target_filename = document.filename.rsplit(".", 1)[0] + ".pdf"

    if not target_path or not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail="File not found on disk")

    content_type, _ = mimetypes.guess_type(target_filename)
    if not content_type:
        content_type = "application/octet-stream"

    from urllib.parse import quote
    safe_name = quote(target_filename, safe="")
    disposition = f"inline; filename*=UTF-8''{safe_name}"

    return FileResponse(
        path=target_path,
        filename=None,
        media_type=content_type,
        headers={"Content-Disposition": disposition},
    )


@router.get("/find-by-name")
async def find_document_by_name(
    filename: str = Query(...),
    user_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Find a document by filename."""
    normalized = unicodedata.normalize("NFC", filename)
    query = select(Document).where(Document.filename == normalized)
    if user_id:
        query = query.where(Document.user_id == user_id)
    result = await db.execute(query.order_by(Document.created_at.desc()))
    document = result.scalars().first()

    # Fallback: try non-normalized filename
    if not document:
        query2 = select(Document).where(Document.filename == filename)
        if user_id:
            query2 = query2.where(Document.user_id == user_id)
        result2 = await db.execute(query2.order_by(Document.created_at.desc()))
        document = result2.scalars().first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "document_id": str(document.id),
        "filename": document.filename,
        "download_url": f"/upload/{document.id}/download",
    }


@router.get("", response_model=list[DocumentSchema])
async def list_documents(
    user_id: str = Query(...),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """List all documents for a user."""
    result = await db.execute(
        select(Document)
        .where(Document.user_id == user_id)
        .order_by(Document.created_at.desc())
    )
    return result.scalars().all()
