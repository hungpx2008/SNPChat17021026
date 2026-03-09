"""
Media tasks — Queue: media_process

Tasks:
  - process_document: Upload → Docling deep processing → Embed → Qdrant
  - transcribe_audio: Whisper speech-to-text → Embed → Qdrant
  - generate_chart: Lida chart generation
  - text_to_speech: Edge-TTS voice synthesis
"""
import logging
import os
import subprocess
from concurrent.futures import ThreadPoolExecutor
from typing import Any
from uuid import uuid4

from .celery_app import celery_app

logger = logging.getLogger(__name__)


# =============================================================================
# 🔵 QUEUE: media_process — Document Processing (Docling only)
# =============================================================================

@celery_app.task(name="src.worker.tasks.process_document", bind=True, max_retries=2)
def process_document(
    self,
    file_path: str,
    user_id: str | None = None,
    original_filename: str | None = None,
    document_id: str | None = None,
) -> dict[str, Any]:
    """
    Process a document through Docling deep pipeline.

    Supports: PDF, DOCX, XLSX, PPTX, MD, TXT, images (.jpg/.png via VLM).
    All documents go through Docling — no quality gating, no user choice needed.

    Pipeline:
      1. Images (.jpg/.png) → VLM description text
      2. All others → Docling DocumentConverter
         - Understands tables, headings, page structure
         - AdaptiveTableSerializer → triplet cell text
         - HybridChunker → semantic chunks with context prefix
      3. Chunks → Embed (Mem0) → Qdrant port_knowledge
    """
    from .helpers import _smart_chunk, _update_document_status

    filename = original_filename or os.path.basename(file_path)
    file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0
    logger.info(f"[process] Starting Docling processing: {filename} ({file_size / 1024:.1f} KB)")

    preview_pdf_path: str | None = None

    try:
        _, ext = os.path.splitext(filename.lower())
        prechunked_chunks: list[dict[str, Any]] | None = None
        extracted_text = ""
        page_count = 0
        table_count = 0
        deep_meta: dict[str, Any] | None = None

        # --- Branch A: Images → VLM ---
        if ext in (".jpg", ".jpeg", ".png"):
            logger.info(f"[process] Image file detected → calling VLM")
            from src.worker.helpers import _extract_text_from_image
            extracted_text = _extract_text_from_image(file_path)
            page_count = 1
            table_count = 0
            deep_meta = {"extractor": "vlm", "vlm_model": os.getenv("LLM_MODEL", "gpt-4o-mini")}

        # --- Branch B: All other documents → Docling ---
        else:
            # PPTX → convert to PDF for preview (parallel to Docling processing)
            if ext in (".pptx", ".ppt"):
                try:
                    out_dir = os.path.dirname(file_path) or "/tmp"
                    subprocess.run(
                        ["libreoffice", "--headless", "--convert-to", "pdf", "--outdir", out_dir, file_path],
                        check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                    )
                    base = os.path.splitext(os.path.basename(file_path))[0]
                    pdf_candidate = os.path.join(out_dir, f"{base}.pdf")
                    if os.path.exists(pdf_candidate):
                        preview_pdf_path = pdf_candidate
                        logger.info(f"[process] PPTX preview PDF at {preview_pdf_path}")
                except Exception as exc:
                    logger.warning(f"[process] PPTX→PDF conversion failed: {exc}")

            logger.info(f"[process] Sending to Docling: {filename}")
            from src.services.docling_service import process_document_deep
            deep_result = process_document_deep(file_path)

            if not deep_result.markdown:
                raise ValueError(f"Docling returned empty result for {filename}")

            extracted_text = deep_result.markdown
            page_count = deep_result.page_count
            table_count = len(deep_result.tables)
            deep_meta = deep_result.metadata or None

            prechunked_chunks = [
                {
                    "text": chunk.text,
                    "page": chunk.page_number,
                    "headings": chunk.headings,
                    "row_keys": (
                        chunk.metadata.get("row_keys")
                        if isinstance(chunk.metadata, dict)
                        else []
                    ),
                }
                for chunk in deep_result.chunks
                if chunk.text and chunk.text.strip()
            ]
            logger.info(
                f"[process] Docling done: {len(extracted_text)} chars, "
                f"{table_count} tables, {page_count} pages, "
                f"{len(prechunked_chunks)} chunks"
            )

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
            extractor_used="docling" if ext not in (".jpg", ".jpeg", ".png") else "vlm",
            preview_pdf_path=preview_pdf_path,
            prechunked_chunks=prechunked_chunks,
            meta_extra=deep_meta,
        )

    except Exception as exc:
        logger.exception(f"[process] Error processing {filename}: {exc}")
        if document_id:
            from .helpers import _update_document_status
            _update_document_status(
                document_id=document_id,
                status="error",
                error_message=str(exc),
            )
        raise self.retry(exc=exc, countdown=10)


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
    preview_pdf_path: str | None = None,
    prechunked_chunks: list[dict[str, Any]] | None = None,
    meta_extra: dict | None = None,
) -> dict[str, Any]:
    """
    Shared embedding + upsert pipeline.
    Called by process_document after text/chunks are ready.
    """
    from .helpers import _smart_chunk, _update_document_status

    # 1. Chunking
    chunk_payload_meta: list[dict[str, Any]] = []
    if prechunked_chunks:
        # Use Docling-native semantic chunks
        chunks_with_pages: list[tuple[str, int]] = []
        for item in prechunked_chunks:
            text = (item.get("text") or "").strip()
            if not text:
                continue
            raw_page = item.get("page") or 1
            try:
                page_num = max(1, int(raw_page) if raw_page is not None else 1)
            except Exception:
                page_num = 1
            chunks_with_pages.append((text, page_num))
            chunk_payload_meta.append({
                "headings": item.get("headings") or [],
                "row_keys": item.get("row_keys") or [],
            })
        logger.info(f"[chunking] Using {len(chunks_with_pages)} Docling-native chunks for {filename}")
    else:
        # Fallback: smart_chunk for VLM image descriptions
        chunks_with_pages = _smart_chunk(extracted_text, chunk_size=512, overlap=50)
        chunk_payload_meta = [{} for _ in chunks_with_pages]
        logger.info(f"[chunking] Smart-chunked {len(chunks_with_pages)} chunks for {filename}")

    if not chunks_with_pages:
        raise ValueError(f"No chunks generated for {filename}")

    # 2. Embed via Mem0 — parallel
    from src.core.http_client import get_http_client
    mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")
    embed_url = f"{mem0_url.rstrip('/')}/embed"
    http_client = get_http_client(timeout=30.0)

    def _embed_chunk(chunk_text: str) -> list[float]:
        resp = http_client.post(embed_url, json={"text": chunk_text})
        resp.raise_for_status()
        return resp.json()["vector"]

    chunk_texts = [ct for ct, _ in chunks_with_pages]
    with ThreadPoolExecutor(max_workers=min(len(chunk_texts), 8)) as pool:
        vectors = list(pool.map(_embed_chunk, chunk_texts))

    # 3. Build payloads
    payloads: list[dict[str, Any]] = []
    vector_ids: list[str] = []
    for i, (chunk_text, page_num) in enumerate(chunks_with_pages):
        meta_for_chunk = chunk_payload_meta[i] if i < len(chunk_payload_meta) else {}
        vid = str(uuid4())
        vector_ids.append(vid)
        payload: dict[str, Any] = {
            "text": chunk_text,
            "source_file": filename,
            "page_number": page_num,
            "chunk_index": i,
            "user_id": user_id,
            "document_id": document_id,
            "type": "document_chunk",
            "extractor": extractor_used,
        }
        headings = meta_for_chunk.get("headings")
        if isinstance(headings, list) and headings:
            payload["headings"] = headings
        row_keys = meta_for_chunk.get("row_keys")
        if isinstance(row_keys, list) and row_keys:
            payload["row_keys"] = row_keys
        payloads.append(payload)

    # 4. Upsert to Qdrant
    from src.core.qdrant_setup import upsert_vectors
    upsert_vectors("port_knowledge", payloads, vectors, ids=vector_ids)
    logger.info(f"[qdrant] Upserted {len(payloads)} vectors for {filename}")

    # 5. Update document status in DB
    if document_id:
        meta: dict[str, Any] = {
            "page_count": page_count,
            "table_count": table_count,
            "char_count": len(extracted_text),
        }
        if preview_pdf_path:
            meta["preview_pdf_path"] = preview_pdf_path
        if meta_extra:
            meta.update(meta_extra)
        _update_document_status(
            document_id=document_id,
            status="ready",
            chunk_count=len(chunks_with_pages),
            extractor_used=extractor_used,
            metadata=meta,
        )

    return {
        "status": "success",
        "filename": filename,
        "extractor": extractor_used,
        "chunks": len(chunks_with_pages),
        "pages": page_count,
        "tables": table_count,
    }


# =============================================================================
# 🔵 QUEUE: media_process — Audio Speech-to-Text
# =============================================================================
_whisper_model = None


def _get_whisper_model():
    global _whisper_model  # noqa: PLW0603
    if _whisper_model is None:
        from faster_whisper import WhisperModel
        model_name = os.getenv("WHISPER_MODEL", "small")
        compute_type = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
        logger.info(f"[whisper] Loading model {model_name} (compute_type={compute_type})")
        _whisper_model = WhisperModel(model_name, device="cpu", compute_type=compute_type)
    return _whisper_model


@celery_app.task(name="src.worker.tasks.transcribe_audio", bind=True, max_retries=2)
def transcribe_audio(
    self,
    file_path: str,
    user_id: str | None = None,
    original_filename: str | None = None,
    document_id: str | None = None,
) -> dict[str, Any]:
    from .helpers import _smart_chunk, _update_document_status

    filename = original_filename or os.path.basename(file_path)
    logger.info(f"[stt] Transcribing audio: {filename}")

    try:
        model = _get_whisper_model()
    except Exception as exc:
        logger.exception(f"[stt] Failed to load Whisper model: {exc}")
        if document_id:
            _update_document_status(document_id=document_id, status="error", error_message=f"Whisper load failed: {exc}")
        raise self.retry(exc=exc, countdown=10)

    try:
        segments_iter, info = model.transcribe(file_path, beam_size=1)
        full_text: list[str] = []
        segment_payloads: list[dict] = []
        for seg in segments_iter:
            text = (seg.text or "").strip()
            if not text:
                continue
            full_text.append(text)
            segment_payloads.append({"start": seg.start, "end": seg.end, "text": text})

        transcript = " ".join(full_text).strip()
        if not transcript:
            raise ValueError("No transcript produced")

        chunks_with_pages = _smart_chunk(transcript, chunk_size=512, overlap=50)
        logger.info(f"[stt] {len(transcript)} chars → {len(chunks_with_pages)} chunks")

        from src.core.http_client import get_http_client
        mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")
        embed_url = f"{mem0_url.rstrip('/')}/embed"
        http_client = get_http_client(timeout=30.0)

        def _embed_chunk(chunk_text: str) -> list[float]:
            resp = http_client.post(embed_url, json={"text": chunk_text})
            resp.raise_for_status()
            return resp.json()["vector"]

        chunk_texts = [ct for ct, _ in chunks_with_pages]
        with ThreadPoolExecutor(max_workers=min(len(chunk_texts), 8)) as pool:
            vectors = list(pool.map(_embed_chunk, chunk_texts))

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
                "type": "audio_transcript",
                "extractor": "whisper_local",
            })

        from src.core.qdrant_setup import upsert_vectors
        upsert_vectors("port_knowledge", payloads, vectors, ids=vector_ids)
        logger.info(f"[stt] Upserted {len(payloads)} chunks to Qdrant")

        if document_id:
            _update_document_status(
                document_id=document_id,
                status="ready",
                chunk_count=len(chunks_with_pages),
                extractor_used="whisper_local",
                metadata={
                    "char_count": len(transcript),
                    "segment_count": len(segment_payloads),
                    "transcript": transcript,
                    "segments": segment_payloads,
                    "duration": getattr(info, "duration", None),
                },
            )

        return {
            "status": "success",
            "transcript": transcript[:200] + ("..." if len(transcript) > 200 else ""),
            "chunks": len(chunks_with_pages),
        }

    except Exception as exc:
        logger.exception(f"[stt] Error transcribing {filename}: {exc}")
        if document_id:
            _update_document_status(document_id=document_id, status="error", error_message=str(exc))
        raise self.retry(exc=exc, countdown=10)


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
    logger.info(f"[media_process] TTS for: {text[:50]}...")
    try:
        from src.services.tts_service import get_tts_service
        tts = get_tts_service()
        result = tts.synthesize_sync(text, voice, output_format)
        return {"status": "ok", **result}
    except Exception as exc:
        logger.exception(f"Error in TTS: {exc}")
        raise self.retry(exc=exc, countdown=3)
