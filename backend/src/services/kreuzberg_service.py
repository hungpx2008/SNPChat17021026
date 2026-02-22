"""
Kreuzberg Service — Fast Path text extraction.

Handles simple documents (PDF text, DOCX, XLSX, MD, TXT) quickly with
minimal resource usage. Returns extracted text + quality heuristics so
the pipeline can decide whether to fall back to the Docling deep path.
"""
from __future__ import annotations

import logging
import os
import re
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)

# File size threshold: above this → always go Docling
MAX_FAST_PATH_BYTES = 5 * 1024 * 1024  # 5 MB


@dataclass
class ExtractionResult:
    """Result returned by the fast extractor."""
    text: str = ""
    metadata: dict = field(default_factory=dict)
    has_tables: bool = False
    quality_score: float = 1.0  # 0.0 – 1.0 (lower = likely needs Docling)
    page_count: int = 0
    source_file: str = ""


def _detect_tables(text: str) -> bool:
    """Heuristic: check if extracted text contains table-like patterns."""
    # Markdown-style tables
    if re.search(r"\|.*\|.*\|", text):
        return True
    # Tab-separated columns (≥3 tabs on a single line)
    if re.search(r"^[^\t]+\t[^\t]+\t[^\t]+", text, re.MULTILINE):
        return True
    # Repeated aligned numbers (common in port fee tables)
    number_lines = len(re.findall(r"^\s*[\d,.]+\s+[\d,.]+", text, re.MULTILINE))
    if number_lines >= 3:
        return True
    return False


def _compute_quality_score(text: str, file_size: int) -> float:
    """
    Heuristic quality score (0.0–1.0).
    Low score → text is garbled / too sparse → Docling should handle it.
    """
    if not text.strip():
        return 0.0

    text_len = len(text.strip())

    # Ratio of printable chars to total chars
    printable = sum(1 for ch in text if ch.isprintable() or ch in "\n\t")
    printable_ratio = printable / max(len(text), 1)

    # Ratio of extracted text to file size (very low = likely image-heavy PDF)
    density = text_len / max(file_size, 1)

    # Word count heuristic
    word_count = len(text.split())
    avg_word_len = text_len / max(word_count, 1)

    score = 1.0

    # Penalize garbled text (lots of non-printable chars)
    if printable_ratio < 0.85:
        score -= 0.3

    # Penalize very low density (image PDF scanned → almost no text)
    if density < 0.01:
        score -= 0.3

    # Penalize absurdly short or long avg word length (≈ garbled)
    if avg_word_len > 20 or avg_word_len < 2:
        score -= 0.2

    return max(0.0, min(1.0, score))


async def extract_text(file_path: str) -> ExtractionResult:
    """
    Extract text from a document using Kreuzberg (async).
    Supports: PDF, DOCX, XLSX, PPTX, MD, TXT, images (via Tesseract).
    """
    from kreuzberg import extract_file

    filename = os.path.basename(file_path)
    file_size = os.path.getsize(file_path)

    logger.info(f"[kreuzberg] Extracting: {filename} ({file_size / 1024:.1f} KB)")

    try:
        result = await extract_file(file_path)
        text = result.content if hasattr(result, "content") else str(result)

        has_tables = _detect_tables(text)
        quality = _compute_quality_score(text, file_size)

        # If file is too big, hint that Docling should handle it
        if file_size > MAX_FAST_PATH_BYTES:
            quality = min(quality, 0.5)

        page_count = text.count("\f") + 1  # form-feed = page break in PDFs

        logger.info(
            f"[kreuzberg] Done: {filename} — "
            f"{len(text)} chars, quality={quality:.2f}, tables={has_tables}, pages={page_count}"
        )

        return ExtractionResult(
            text=text,
            metadata={
                "extractor": "kreuzberg",
                "file_size": file_size,
                "char_count": len(text),
            },
            has_tables=has_tables,
            quality_score=quality,
            page_count=page_count,
            source_file=filename,
        )
    except Exception as e:
        logger.exception(f"[kreuzberg] Failed to extract {filename}: {e}")
        return ExtractionResult(
            text="",
            metadata={"extractor": "kreuzberg", "error": str(e)},
            has_tables=False,
            quality_score=0.0,
            page_count=0,
            source_file=filename,
        )


def extract_text_sync(file_path: str) -> ExtractionResult:
    """Synchronous wrapper for use inside Celery tasks."""
    import asyncio

    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                return pool.submit(
                    asyncio.run, extract_text(file_path)
                ).result()
        return loop.run_until_complete(extract_text(file_path))
    except RuntimeError:
        return asyncio.run(extract_text(file_path))
