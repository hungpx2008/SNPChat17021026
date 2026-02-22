"""
Upload API — File upload and document management endpoints.
"""
from __future__ import annotations

import os
import shutil
import mimetypes
import unicodedata
from typing import Any, Literal, Optional
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

# Allowed file extensions
ALLOWED_EXTENSIONS = {
    ".pdf", ".docx", ".doc", ".xlsx", ".xls",
    ".pptx", ".ppt", ".md", ".txt", ".csv",
}


def _validate_extension(filename: str) -> str:
    """Validate and return the file extension."""
    _, ext = os.path.splitext(filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{ext}' not supported. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )
    return ext


def _delete_qdrant_chunks(document_id: str) -> int:
    """Delete all Qdrant chunks for a document. Returns count deleted."""
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
        return 1
    except Exception as e:
        print(f"Warning: Failed to delete Qdrant chunks for {document_id}: {e}")
        return 0


@router.post("", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None),
    force_deep_scan: bool = Form(False),
    overwrite: bool = Form(False),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """
    Upload a document for processing.
    
    - Checks for duplicate filename per user
    - If overwrite=false and duplicate exists, returns 409 with existing doc info
    - If overwrite=true, deletes old chunks and re-processes
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = _validate_extension(file.filename)

    # Check for duplicate filename for this user (normalize Unicode for Vietnamese)
    normalized_filename = unicodedata.normalize('NFC', file.filename)
    if user_id:
        result = await db.execute(
            select(Document)
            .where(Document.user_id == user_id, Document.filename == normalized_filename)
            .order_by(Document.created_at.desc())
        )
        existing_doc = result.scalars().first()

        if existing_doc and not overwrite:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "message": f"Tài liệu '{file.filename}' đã tồn tại. Bạn có muốn ghi đè không?",
                    "existing_document_id": str(existing_doc.id),
                    "existing_filename": existing_doc.filename,
                    "existing_status": existing_doc.status,
                },
            )

        if existing_doc and overwrite:
            # Delete old Qdrant chunks
            _delete_qdrant_chunks(str(existing_doc.id))
            # Delete old file
            if existing_doc.file_path and os.path.exists(existing_doc.file_path):
                os.remove(existing_doc.file_path)
            # Delete old DB record
            await db.delete(existing_doc)
            await db.flush()

    # Generate unique filename
    doc_id = uuid4()
    safe_filename = f"{doc_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    # Ensure upload directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    # Create document record
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

    # Trigger Phase 1 analysis (decides auto-process vs awaiting_choice)
    from src.worker.tasks import analyze_document
    analyze_document.delay(
        file_path=file_path,
        user_id=user_id,
        original_filename=file.filename,
        document_id=str(doc_id),
    )

    return DocumentUploadResponse(
        document_id=doc_id,
        filename=file.filename,
        status="processing",
        message="Document uploaded and queued for analysis.",
    )


@router.post("/{document_id}/process")
async def process_document_with_choice(
    document_id: UUID,
    engine: Literal["kreuzberg", "docling"] = Query(...),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """
    Phase 2: User chose an extraction engine for a complex document.
    Only valid when document status is 'awaiting_choice'.
    """
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if document.status != "awaiting_choice":
        raise HTTPException(
            status_code=400,
            detail=f"Document status is '{document.status}', expected 'awaiting_choice'",
        )

    # Update status to processing
    document.status = "processing"
    document.extractor_used = engine
    await db.commit()

    # Dispatch Phase 2 task
    from src.worker.tasks import process_document_with_engine
    process_document_with_engine.delay(
        file_path=document.file_path,
        engine=engine,
        user_id=document.user_id,
        original_filename=document.filename,
        document_id=str(document_id),
    )

    return {
        "status": "processing",
        "engine": engine,
        "document_id": str(document_id),
        "message": f"Processing with {engine}. Please wait...",
    }


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
    Cancel document processing and rollback:
    - Delete Qdrant chunks
    - Delete uploaded file
    - Delete DB record
    """
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Rollback: delete Qdrant chunks
    _delete_qdrant_chunks(str(document_id))

    # Delete file
    if document.file_path and os.path.exists(document.file_path):
        os.remove(document.file_path)

    # Delete DB record
    await db.delete(document)
    await db.commit()

    return {"status": "cancelled", "document_id": str(document_id), "message": "Document deleted and all chunks rolled back."}


@router.get("/{document_id}/download")
async def download_document(
    document_id: UUID,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Preview/open the uploaded document file in browser (inline, not download)."""
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    if not document.file_path or not os.path.exists(document.file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")

    # Detect MIME type for inline preview
    content_type, _ = mimetypes.guess_type(document.filename or document.file_path)
    if not content_type:
        content_type = "application/octet-stream"

    # RFC 5987 encoding for non-ASCII filenames
    from urllib.parse import quote
    safe_name = quote(document.filename, safe='')
    disposition = f"inline; filename*=UTF-8''{safe_name}"

    return FileResponse(
        path=document.file_path,
        filename=None,  # Don't let FileResponse set filename (causes latin-1 error)
        media_type=content_type,
        headers={"Content-Disposition": disposition},
    )


@router.get("/find-by-name")
async def find_document_by_name(
    filename: str = Query(...),
    user_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Find a document by filename. Returns doc info for download link."""
    # Normalize Unicode for Vietnamese filenames (NFC vs NFD)
    normalized = unicodedata.normalize('NFC', filename)
    query = select(Document).where(Document.filename == normalized)
    if user_id:
        query = query.where(Document.user_id == user_id)
    query = query.order_by(Document.created_at.desc())
    result = await db.execute(query)
    document = result.scalars().first()
    # Fallback: try original (non-normalized) filename
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

