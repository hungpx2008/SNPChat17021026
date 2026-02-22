"""
Media tasks — Queue: media_process

Tasks:
  - analyze_document: Phase 1 — fast extraction + quality analysis → auto-process or AWAITING_CHOICE
  - process_document_with_engine: Phase 2 — process with user-chosen engine
  - process_document: Legacy entry point (kept for backward compatibility)
  - generate_chart: Lida chart generation
  - text_to_speech: Edge-TTS voice synthesis
"""
import logging
import os
from concurrent.futures import ThreadPoolExecutor
from typing import Any
from uuid import uuid4

from .celery_app import celery_app

logger = logging.getLogger(__name__)

# Thresholds for auto-processing vs user choice
AUTO_PROCESS_MAX_BYTES = 5 * 1024 * 1024  # 5 MB
AUTO_PROCESS_MIN_QUALITY = 0.7


# =============================================================================
# 🔵 QUEUE: media_process — Document Processing (2-Phase)
# =============================================================================

@celery_app.task(name="src.worker.tasks.analyze_document", bind=True, max_retries=2)
def analyze_document(
    self,
    file_path: str,
    user_id: str | None = None,
    original_filename: str | None = None,
    document_id: str | None = None,
) -> dict[str, Any]:
    """
    Phase 1: Fast analysis — run Kreuzberg to get metadata + quality score.

    Decision:
      - Simple file (quality >= 0.7, no tables, < 5MB) → auto-process with Kreuzberg
      - Complex file → set status to 'awaiting_choice', let user pick engine
    """
    from .helpers import _smart_chunk, _update_document_status

    filename = original_filename or os.path.basename(file_path)
    file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0
    logger.info(f"[analyze] Phase 1 for: {filename} ({file_size / 1024:.1f} KB)")

    try:
        # --- Run Kreuzberg fast extraction ---
        from src.services.kreuzberg_service import extract_text_sync
        kreuz_result = extract_text_sync(file_path)

        quality = kreuz_result.quality_score
        has_tables = kreuz_result.has_tables
        extracted_text = kreuz_result.text
        page_count = kreuz_result.page_count

        logger.info(
            f"[analyze] Kreuzberg result: {len(extracted_text)} chars, "
            f"quality={quality:.2f}, tables={has_tables}, pages={page_count}"
        )

        # --- Decision: auto-process or await user choice? ---
        is_simple = (
            quality >= AUTO_PROCESS_MIN_QUALITY
            and not has_tables
            and file_size < AUTO_PROCESS_MAX_BYTES
        )

        if is_simple:
            # Auto-process with Kreuzberg — no user interaction needed
            logger.info(f"[analyze] Simple file → auto-processing with Kreuzberg")
            return _do_full_processing(
                file_path=file_path,
                filename=filename,
                document_id=document_id,
                user_id=user_id,
                extracted_text=extracted_text,
                page_count=page_count,
                table_count=0,
                extractor_used="kreuzberg",
            )
        else:
            # Complex file → pause and let user choose
            reason_parts = []
            if has_tables:
                reason_parts.append("phát hiện bảng biểu")
            if quality < AUTO_PROCESS_MIN_QUALITY:
                reason_parts.append(f"chất lượng trích xuất thấp ({quality:.0%})")
            if file_size >= AUTO_PROCESS_MAX_BYTES:
                reason_parts.append(f"file lớn ({file_size / 1024 / 1024:.1f} MB)")
            reason = ", ".join(reason_parts)

            logger.info(f"[analyze] Complex file → awaiting_choice (reason: {reason})")

            if document_id:
                _update_document_status(
                    document_id=document_id,
                    status="awaiting_choice",
                    metadata={
                        "analysis": {
                            "quality_score": quality,
                            "has_tables": has_tables,
                            "file_size": file_size,
                            "page_count": page_count,
                            "char_count": len(extracted_text),
                            "reason": reason,
                            "kreuzberg_text_available": bool(extracted_text.strip()),
                        }
                    },
                )

            return {
                "status": "awaiting_choice",
                "filename": filename,
                "reason": reason,
                "quality_score": quality,
                "has_tables": has_tables,
                "file_size": file_size,
            }

    except Exception as exc:
        logger.exception(f"Error analyzing document {filename}: {exc}")
        if document_id:
            _update_document_status(
                document_id=document_id,
                status="error",
                error_message=f"Analysis failed: {exc}",
            )
        raise self.retry(exc=exc, countdown=5)


@celery_app.task(name="src.worker.tasks.process_document_with_engine", bind=True, max_retries=2)
def process_document_with_engine(
    self,
    file_path: str,
    engine: str,  # "kreuzberg" or "docling"
    user_id: str | None = None,
    original_filename: str | None = None,
    document_id: str | None = None,
) -> dict[str, Any]:
    """
    Phase 2: Process document with user-chosen engine.
    Called after user selects Kreuzberg or Docling from the UI.
    """
    from .helpers import _update_document_status

    filename = original_filename or os.path.basename(file_path)
    logger.info(f"[process] Phase 2 for: {filename} with engine={engine}")

    try:
        extracted_text = ""
        page_count = 0
        table_count = 0

        if engine == "docling":
            # Deep processing with Docling
            logger.info(f"[docling] Deep processing: {filename}")
            try:
                from src.services.docling_service import process_document_deep
                deep_result = process_document_deep(file_path)
                if deep_result.markdown:
                    extracted_text = deep_result.markdown
                    page_count = deep_result.page_count
                    table_count = len(deep_result.tables)
                    logger.info(
                        f"[docling] Done: {len(extracted_text)} chars, "
                        f"{table_count} tables, {page_count} pages"
                    )
                else:
                    raise ValueError("Docling returned empty result")
            except ImportError:
                logger.error("[docling] Docling not available!")
                if document_id:
                    _update_document_status(
                        document_id=document_id,
                        status="error",
                        error_message="Docling chưa được cài đặt trên server",
                    )
                return {"status": "error", "message": "Docling not available"}

        else:
            # Fast processing with Kreuzberg (re-extract or use cached)
            logger.info(f"[kreuzberg] Fast processing: {filename}")
            from src.services.kreuzberg_service import extract_text_sync
            kreuz_result = extract_text_sync(file_path)
            extracted_text = kreuz_result.text
            page_count = kreuz_result.page_count

        if not extracted_text.strip():
            raise ValueError(f"No text extracted from {filename}")

        return _do_full_processing(
            file_path=file_path,
            filename=filename,
            document_id=document_id,
            user_id=user_id,
            extracted_text=extracted_text,
            page_count=page_count,
            table_count=table_count,
            extractor_used=engine,
        )

    except Exception as exc:
        logger.exception(f"Error processing document {filename} with {engine}: {exc}")
        if document_id:
            _update_document_status(
                document_id=document_id,
                status="error",
                error_message=str(exc),
            )
        raise self.retry(exc=exc, countdown=5)


def _do_full_processing(
    *,
    file_path: str,
    filename: str,
    document_id: str | None,
    user_id: str | None,
    extracted_text: str,
    page_count: int,
    table_count: int,
    extractor_used: str,
) -> dict[str, Any]:
    """
    Shared processing pipeline: chunk → embed → Qdrant upsert → update DB.
    Used by both auto-processing (Phase 1) and user-chosen processing (Phase 2).
    """
    import httpx
    from .helpers import _smart_chunk, _update_document_status

    # 1. Smart Chunking
    chunks_with_pages = _smart_chunk(extracted_text, chunk_size=512, overlap=50)
    logger.info(f"[chunking] Created {len(chunks_with_pages)} chunks for {filename}")

    # 2. Embed via Mem0 — parallel with ThreadPoolExecutor
    mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")
    embed_url = f"{mem0_url.rstrip('/')}/embed"

    def _embed_chunk(chunk_text: str) -> list[float]:
        with httpx.Client(timeout=30.0) as client:
            resp = client.post(embed_url, json={"text": chunk_text})
            resp.raise_for_status()
            return resp.json()["vector"]

    chunk_texts = [ct for ct, _ in chunks_with_pages]
    max_workers = min(len(chunk_texts), 8)
    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        vectors = list(pool.map(_embed_chunk, chunk_texts))

    # 3. Build payloads with metadata for citations
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

    # 4. Upsert to Qdrant
    from src.core.qdrant_setup import upsert_vectors
    upsert_vectors("port_knowledge", payloads, vectors, ids=vector_ids)
    logger.info(f"[qdrant] Upserted {len(payloads)} vectors to port_knowledge")

    # 5. Update document status
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


# =============================================================================
# Legacy entry point — kept for backward compatibility
# =============================================================================

@celery_app.task(name="src.worker.tasks.process_document", bind=True, max_retries=2)
def process_document(
    self,
    file_path: str,
    user_id: str | None = None,
    original_filename: str | None = None,
    document_id: str | None = None,
    force_deep_scan: bool = False,
) -> dict[str, Any]:
    """Legacy: direct processing without user choice. Kept for backward compat."""
    engine = "docling" if force_deep_scan else "kreuzberg"
    return process_document_with_engine(
        file_path=file_path,
        engine=engine,
        user_id=user_id,
        original_filename=original_filename,
        document_id=document_id,
    )


# =============================================================================
# 🔵 QUEUE: media_process — Charts & TTS
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
    Output: path tới file PNG trong shared media volume.
    """
    logger.info(f"[media_process] Generating chart for: {query[:50]}...")
    try:
        import pandas as pd
        from src.services.lida_service import get_lida_service

        if data is None:
            return {"status": "error", "message": "No data provided"}

        df = pd.DataFrame(data)
        lida = get_lida_service()
        result = lida.generate_chart(query, df, chart_type)
        return {"status": "ok", **result}
    except Exception as exc:
        logger.exception(f"Error generating chart: {exc}")
        raise self.retry(exc=exc, countdown=3)


@celery_app.task(name="src.worker.tasks.text_to_speech", bind=True, max_retries=2)
def text_to_speech(
    self,
    text: str,
    session_id: str | None = None,
    voice: str = "vi-VN-HoaiMyNeural",
    output_format: str = "mp3",
) -> dict[str, Any]:
    """
    Edge-TTS: Chuyển văn bản thành giọng nói tiếng Việt.
    Output: path tới file MP3 trong shared media volume.
    """
    logger.info(f"[media_process] TTS for: {text[:50]}...")
    try:
        from src.services.tts_service import get_tts_service
        tts = get_tts_service()
        result = tts.synthesize_sync(text, voice, output_format)
        return {"status": "ok", **result}
    except Exception as exc:
        logger.exception(f"Error in TTS: {exc}")
        raise self.retry(exc=exc, countdown=3)
