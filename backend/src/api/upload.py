"""
Upload API — File upload and document management endpoints.
"""
from __future__ import annotations

import os
import shutil
from typing import Any, Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
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


@router.post("", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None),
    force_deep_scan: bool = Form(False),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """
    Upload a document for processing.
    
    - Saves file to /app/media/uploads/
    - Creates a Document record in PostgreSQL
    - Triggers async Celery task for hybrid processing (Kreuzberg → Docling)
    - Returns document_id for status tracking
    
    Args:
        file: The document to upload
        user_id: Optional user identifier
        force_deep_scan: Skip Kreuzberg and go straight to Docling
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = _validate_extension(file.filename)

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

    # Trigger Celery task
    from src.worker.tasks import process_document
    process_document.delay(
        file_path=file_path,
        user_id=user_id,
        original_filename=file.filename,
        document_id=str(doc_id),
        force_deep_scan=force_deep_scan,
    )

    return DocumentUploadResponse(
        document_id=doc_id,
        filename=file.filename,
        status="processing",
        message="Document uploaded and queued for processing.",
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
