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

        # --- Branch A: Images → VLM + optional OCR ---
        if ext in (".jpg", ".jpeg", ".png"):
            logger.info(f"[process] Image file detected → calling VLM")
            from src.worker.helpers import _extract_text_from_image
            vlm_text = _extract_text_from_image(file_path)
            page_count = 1
            table_count = 0
            deep_meta = {"extractor": "vlm", "vlm_model": os.getenv("LLM_MODEL", "gpt-4o-mini")}

            # Phase 9: Try OCR on image for text-heavy content (receipts, forms, etc.)
            ocr_text = ""
            from src.services.ocr_service import OCRService
            if OCRService.is_ocr_enabled():
                try:
                    ocr_service = OCRService()
                    ocr_result = ocr_service.extract_from_image(file_path)
                    if ocr_result.text.strip():
                        ocr_text = ocr_result.text.strip()
                        deep_meta["ocr_text_length"] = len(ocr_text)
                        deep_meta["ocr_confidence"] = ocr_result.confidence
                        logger.info(
                            f"[ocr] Image OCR extracted {len(ocr_text)} chars "
                            f"(confidence={ocr_result.confidence:.2f})"
                        )
                except Exception as ocr_exc:
                    logger.warning(f"[ocr] Image OCR failed: {ocr_exc}. Using VLM only.")

            # Combine: OCR text (primary if available) + VLM description (supplementary)
            if ocr_text:
                extracted_text = (
                    f"[OCR text từ ảnh]\n{ocr_text}\n\n"
                    f"[Mô tả hình ảnh (VLM)]\n{vlm_text}"
                )
                deep_meta["extractor"] = "vlm+paddleocr"
            else:
                extracted_text = vlm_text

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

            # ── Phase 9: PaddleOCR fallback for scanned PDFs ──────────
            # If Docling extracted very little text, the PDF is likely
            # scanned/photographed. Fall back to OCR if enabled.
            if ext == ".pdf":
                from src.services.ocr_service import OCRService
                if (
                    OCRService.is_ocr_enabled()
                    and OCRService.is_scanned_pdf(extracted_text, page_count)
                ):
                    logger.info(
                        f"[process] Scanned PDF detected ({len(extracted_text)} chars / "
                        f"{page_count} pages = "
                        f"{len(extracted_text) // max(page_count, 1)} chars/page). "
                        f"Falling back to PaddleOCR..."
                    )
                    try:
                        ocr_service = OCRService()
                        ocr_result = ocr_service.extract_from_pdf(file_path)

                        if ocr_result.text.strip():
                            # OCR succeeded — replace Docling output
                            extracted_text = ocr_result.text
                            prechunked_chunks = OCRService.to_prechunked_chunks(ocr_result)
                            deep_meta = {
                                **(deep_meta or {}),
                                "extractor": "paddleocr",
                                "ocr_confidence": ocr_result.confidence,
                                "ocr_pages": len(ocr_result.pages),
                                "docling_fallback_reason": "scanned_pdf",
                            }
                            logger.info(
                                f"[ocr] PaddleOCR extracted {len(extracted_text)} chars, "
                                f"{len(prechunked_chunks)} chunks from scanned PDF"
                            )
                        else:
                            logger.warning(
                                f"[ocr] PaddleOCR returned empty text for {filename}. "
                                "Keeping Docling output."
                            )
                    except Exception as ocr_exc:
                        logger.warning(
                            f"[ocr] PaddleOCR failed for {filename}: {ocr_exc}. "
                            "Continuing with Docling output."
                        )

        if not extracted_text.strip():
            raise ValueError(f"No text extracted from {filename}")

        # Determine extractor used
        if ext in (".jpg", ".jpeg", ".png"):
            _extractor = deep_meta.get("extractor", "vlm") if deep_meta else "vlm"
        elif deep_meta and deep_meta.get("extractor") == "paddleocr":
            _extractor = "paddleocr"
        else:
            _extractor = "docling"

        return _do_full_processing(
            file_path=file_path,
            filename=filename,
            document_id=document_id,
            user_id=user_id,
            extracted_text=extracted_text,
            page_count=page_count,
            table_count=table_count,
            extractor_used=_extractor,
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

    When prechunked_chunks is provided (Docling path), uses parent-child
    chunking: Docling chunks become parents (saved to PostgreSQL), each
    parent is split into smaller children for embedding into Qdrant.
    """
    from .helpers import _smart_chunk, _update_document_status
    from src.services.chunk_splitter import split_into_children
    from src.services.parent_chunk_store import save_parent_chunks

    # 1. Chunking — parent-child for Docling, flat for VLM/fallback
    chunks_with_pages: list[tuple[str, int]] = []
    chunk_payload_meta: list[dict[str, Any]] = []
    use_parent_child = bool(prechunked_chunks)

    if prechunked_chunks:
        # ── Docling path: parent-child chunking ──
        # Step 1a: Build parent_data from Docling's semantic chunks
        parent_data: list[dict[str, Any]] = []
        for item in prechunked_chunks:
            text = (item.get("text") or "").strip()
            if not text:
                continue
            raw_page = item.get("page") or 1
            try:
                page_num = max(1, int(raw_page) if raw_page is not None else 1)
            except Exception:
                page_num = 1
            parent_data.append({
                "content": text,
                "page_number": page_num,
                "headings": item.get("headings") or [],
                "metadata": {
                    "row_keys": item.get("row_keys") or [],
                },
            })

        if not parent_data:
            raise ValueError(f"No valid parent chunks from Docling for {filename}")

        # Step 1b: Save parents to PostgreSQL
        parent_ids = save_parent_chunks(document_id or "", parent_data)
        logger.info(
            f"[chunking] Saved {len(parent_ids)} parent chunks to PostgreSQL for {filename}"
        )

        # Step 1c: Split each parent into children
        all_children: list[dict[str, Any]] = []
        for parent, parent_id in zip(parent_data, parent_ids):
            parent_meta = {
                "page_number": parent["page_number"],
                "headings": parent["headings"],
                "row_keys": parent["metadata"].get("row_keys", []),
            }
            children = split_into_children(
                parent_text=parent["content"],
                parent_id=parent_id,
                parent_meta=parent_meta,
            )
            all_children.extend(children)

        # Step 1d: Build chunks_with_pages and payload meta from children
        for child in all_children:
            child_text = child.get("text", "").strip()
            if not child_text:
                continue
            child_page = child.get("page", 1)
            chunks_with_pages.append((child_text, child_page))
            chunk_payload_meta.append({
                "headings": child.get("headings") or [],
                "row_keys": child.get("row_keys") or [],
                "parent_id": child.get("parent_id", ""),
                "child_chunk_index": child.get("chunk_index", 0),
            })

        logger.info(
            f"[chunking] {len(parent_data)} parents → {len(chunks_with_pages)} "
            f"children for {filename}"
        )
    else:
        # ── Fallback: flat chunks for VLM image descriptions ──
        chunks_with_pages = _smart_chunk(extracted_text, chunk_size=512, overlap=50)
        chunk_payload_meta = [{} for _ in chunks_with_pages]
        logger.info(f"[chunking] Smart-chunked {len(chunks_with_pages)} chunks for {filename}")

    if not chunks_with_pages:
        raise ValueError(f"No chunks generated for {filename}")

    # 2. Embed locally (sentence-transformers)
    from src.worker.chat_tasks import embed_query

    chunk_texts = [ct for ct, _ in chunks_with_pages]
    with ThreadPoolExecutor(max_workers=min(len(chunk_texts), 8)) as pool:
        vectors = list(pool.map(embed_query, chunk_texts))

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
        # Parent-child metadata for 2-tier retrieval
        parent_id = meta_for_chunk.get("parent_id", "")
        if parent_id:
            payload["parent_id"] = parent_id
            payload["is_child"] = True
        payloads.append(payload)

    # 4. Upsert to Qdrant
    from src.core.qdrant_setup import upsert_vectors
    upsert_vectors("port_knowledge", payloads, vectors, ids=vector_ids)
    logger.info(f"[qdrant] Upserted {len(payloads)} vectors for {filename}")

    # 4b. Index into Whoosh for BM25 lexical search (Phase 4: Hybrid Search)
    try:
        from src.services.search.lexical_search import LexicalSearchService
        lexical = LexicalSearchService()
        docs_to_index = []
        for vid, payload in zip(vector_ids, payloads):
            headings = payload.get("headings", [])
            tags = ",".join(headings) if isinstance(headings, list) else ""
            docs_to_index.append({
                "doc_id": vid,
                "title": filename,
                "content": payload.get("text", ""),
                "tags": tags,
                "department": payload.get("department", "") or "",
                "user_id": payload.get("user_id", "") or "",
            })
        indexed = lexical.index_documents_batch(docs_to_index)
        logger.info(f"[whoosh] Indexed {indexed} chunks for {filename}")
    except Exception as exc:
        # Whoosh indexing failure is non-fatal; semantic search still works
        logger.warning(f"[whoosh] Failed to index {filename}: {exc}")

    # 5. Update document status in DB
    if document_id:
        meta: dict[str, Any] = {
            "page_count": page_count,
            "table_count": table_count,
            "char_count": len(extracted_text),
            "parent_child": use_parent_child,
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
        "parent_child": use_parent_child,
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

        from src.worker.chat_tasks import embed_query

        chunk_texts = [ct for ct, _ in chunks_with_pages]
        with ThreadPoolExecutor(max_workers=min(len(chunk_texts), 8)) as pool:
            vectors = list(pool.map(embed_query, chunk_texts))

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
