"""OCR service for scanned documents using PaddleOCR.

Extracts text from images and scanned PDF pages.
Optimized for Vietnamese text with PaddleOCR's multi-language support.

PaddleOCR models are ~200MB. They are loaded lazily on first use
and cached in a Docker volume (/root/.paddleocr) across restarts.

Gate with ENABLE_PADDLE_OCR=true env var (default: false).

Usage:
    ocr = OCRService()
    if OCRService.is_scanned_pdf(docling_text, page_count):
        result = ocr.extract_from_pdf("/path/to/scanned.pdf")
        chunks = OCRService.to_prechunked_chunks(result)
"""
from __future__ import annotations

import logging
import os
import tempfile
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger(__name__)

# ── Constants ────────────────────────────────────────────────────────────
MIN_CHARS_PER_PAGE = 100       # Below this → "scanned" PDF
OCR_LANGUAGE = "vi"            # Vietnamese
OCR_DPI = 300                  # Resolution for PDF-to-image conversion
OCR_CONFIDENCE_THRESHOLD = 0.5 # Minimum confidence to include text line

# Lazy-imported to avoid loading heavy deps at module level
convert_from_path = None  # pdf2image.convert_from_path


def _ensure_pdf2image():
    """Lazy-import pdf2image. Raises ImportError if not installed."""
    global convert_from_path
    if convert_from_path is None:
        from pdf2image import convert_from_path as _cfp
        convert_from_path = _cfp
    return convert_from_path


# ── Dataclasses ──────────────────────────────────────────────────────────


@dataclass
class PageOCRResult:
    """OCR result for a single page."""
    page_number: int
    text: str
    lines: list[dict[str, Any]] = field(default_factory=list)
    confidence: float = 0.0


@dataclass
class OCRResult:
    """Result of OCR processing."""
    text: str                           # Full extracted text (all pages joined)
    pages: list[PageOCRResult] = field(default_factory=list)
    confidence: float = 0.0            # Average confidence score
    language: str = OCR_LANGUAGE


# ── Service ──────────────────────────────────────────────────────────────


class OCRService:
    """PaddleOCR wrapper for Vietnamese text extraction.

    Models are loaded lazily on first call to avoid import-time overhead.
    The OCR engine is cached as a class-level singleton so multiple
    OCRService instances share the same loaded model.

    Attributes:
        LANGUAGE: OCR language code. Default "vi" (Vietnamese).
        DPI: Resolution for PDF page rendering. Default 300.
        CONFIDENCE_THRESHOLD: Minimum confidence to include a text line.
    """

    LANGUAGE = OCR_LANGUAGE
    DPI = OCR_DPI
    CONFIDENCE_THRESHOLD = OCR_CONFIDENCE_THRESHOLD

    # Class-level singleton for the OCR engine (heavy, ~200MB)
    _engine = None

    def _get_ocr_engine(self):
        """Lazy-load PaddleOCR engine. Cached as class singleton."""
        if OCRService._engine is None:
            logger.info(
                f"[ocr] Loading PaddleOCR engine (lang={self.LANGUAGE}). "
                "This may take a few seconds on first run..."
            )
            from paddleocr import PaddleOCR
            OCRService._engine = PaddleOCR(
                lang=self.LANGUAGE,
                use_angle_cls=True,     # Detect rotated text
                show_log=False,         # Suppress PaddleOCR verbose logging
            )
            logger.info("[ocr] PaddleOCR engine loaded successfully.")
        return OCRService._engine

    # ── Static heuristic ─────────────────────────────────────────────

    @staticmethod
    def is_scanned_pdf(
        extracted_text: str,
        page_count: int,
        min_chars_per_page: int = MIN_CHARS_PER_PAGE,
    ) -> bool:
        """Detect if a PDF is scanned (image-based) rather than native text.

        Heuristic: if average chars per page is below threshold,
        the PDF is likely scanned/photographed.

        Args:
            extracted_text: Text extracted by Docling.
            page_count: Number of pages in the PDF.
            min_chars_per_page: Minimum chars/page to consider native.

        Returns:
            True if likely scanned, False if native text.
        """
        if page_count <= 0:
            return False

        text_len = len((extracted_text or "").strip())
        avg_chars = text_len / page_count
        return avg_chars < min_chars_per_page

    @staticmethod
    def is_ocr_enabled() -> bool:
        """Check if PaddleOCR is enabled via environment variable."""
        return os.getenv("ENABLE_PADDLE_OCR", "false").strip().lower() in {
            "1", "true", "yes", "on",
        }

    # ── Image OCR ────────────────────────────────────────────────────

    def extract_from_image(self, image_path: str) -> OCRResult:
        """Extract text from a single image file.

        Args:
            image_path: Path to image file (PNG, JPG, etc.).

        Returns:
            OCRResult with extracted text and per-line details.
        """
        engine = self._get_ocr_engine()
        raw_result = engine.ocr(image_path, cls=True)

        page_result = self._parse_ocr_page(raw_result[0] if raw_result else None, page_number=1)

        return OCRResult(
            text=page_result.text,
            pages=[page_result],
            confidence=page_result.confidence,
            language=self.LANGUAGE,
        )

    # ── PDF OCR ──────────────────────────────────────────────────────

    def extract_from_pdf(self, pdf_path: str) -> OCRResult:
        """Extract text from a scanned PDF.

        Converts each page to an image at DPI resolution, then OCRs each page.

        Args:
            pdf_path: Path to PDF file.

        Returns:
            OCRResult with per-page extracted text.
        """
        _ensure_pdf2image()
        engine = self._get_ocr_engine()

        logger.info(f"[ocr] Converting PDF to images at {self.DPI} DPI: {pdf_path}")
        images = convert_from_path(pdf_path, dpi=self.DPI)
        logger.info(f"[ocr] PDF has {len(images)} pages, starting OCR...")

        pages: list[PageOCRResult] = []
        all_text_parts: list[str] = []
        all_confidences: list[float] = []

        for page_idx, pil_image in enumerate(images):
            page_num = page_idx + 1

            # Save PIL image to temp file for PaddleOCR
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                tmp_path = tmp.name
                pil_image.save(tmp_path, format="PNG")

            try:
                raw_result = engine.ocr(tmp_path, cls=True)
                page_result = self._parse_ocr_page(
                    raw_result[0] if raw_result else None,
                    page_number=page_num,
                )
            finally:
                # Clean up temp file
                try:
                    os.unlink(tmp_path)
                except OSError:
                    pass

            pages.append(page_result)
            if page_result.text:
                all_text_parts.append(page_result.text)
            if page_result.confidence > 0:
                all_confidences.append(page_result.confidence)

            logger.debug(
                f"[ocr] Page {page_num}/{len(images)}: "
                f"{len(page_result.text)} chars, "
                f"confidence={page_result.confidence:.2f}"
            )

        full_text = "\n\n".join(all_text_parts)
        avg_confidence = (
            sum(all_confidences) / len(all_confidences)
            if all_confidences
            else 0.0
        )

        logger.info(
            f"[ocr] PDF OCR complete: {len(pages)} pages, "
            f"{len(full_text)} chars total, "
            f"avg_confidence={avg_confidence:.2f}"
        )

        return OCRResult(
            text=full_text,
            pages=pages,
            confidence=avg_confidence,
            language=self.LANGUAGE,
        )

    # ── Output formatting ────────────────────────────────────────────

    @staticmethod
    def to_prechunked_chunks(ocr_result: OCRResult) -> list[dict[str, Any]]:
        """Convert OCR result to Docling-compatible prechunked_chunks format.

        Returns the same dict structure as Docling chunks so OCR output
        flows through the existing parent-child chunking pipeline unchanged.

        Each page becomes one chunk. This matches how Docling typically
        produces chunks — roughly page-aligned semantic blocks.

        Args:
            ocr_result: OCRResult from extract_from_image or extract_from_pdf.

        Returns:
            List of dicts with keys: text, page, headings, row_keys.
        """
        chunks: list[dict[str, Any]] = []
        for page in ocr_result.pages:
            text = page.text.strip()
            if not text:
                continue
            chunks.append({
                "text": text,
                "page": page.page_number,
                "headings": [],    # OCR cannot infer document headings
                "row_keys": [],    # OCR cannot infer table row keys
            })
        return chunks

    # ── Internal helpers ─────────────────────────────────────────────

    def _parse_ocr_page(
        self,
        raw_page_result: list | None,
        page_number: int,
    ) -> PageOCRResult:
        """Parse raw PaddleOCR output for a single page.

        PaddleOCR returns per-page:
            list of [bbox_points, (text_string, confidence_float)]
        where bbox_points = [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]

        Args:
            raw_page_result: Raw PaddleOCR output for one page (may be None).
            page_number: 1-based page number.

        Returns:
            PageOCRResult with filtered text lines and average confidence.
        """
        if not raw_page_result:
            return PageOCRResult(
                page_number=page_number,
                text="",
                lines=[],
                confidence=0.0,
            )

        lines: list[dict[str, Any]] = []
        text_parts: list[str] = []
        confidences: list[float] = []

        for item in raw_page_result:
            if not item or len(item) < 2:
                continue
            bbox = item[0]
            text_conf = item[1]
            if not isinstance(text_conf, (list, tuple)) or len(text_conf) < 2:
                continue

            text_str = str(text_conf[0]).strip()
            confidence = float(text_conf[1])

            if not text_str:
                continue
            if confidence < self.CONFIDENCE_THRESHOLD:
                continue

            lines.append({
                "bbox": bbox,
                "text": text_str,
                "confidence": confidence,
            })
            text_parts.append(text_str)
            confidences.append(confidence)

        full_text = "\n".join(text_parts)
        avg_confidence = (
            sum(confidences) / len(confidences) if confidences else 0.0
        )

        return PageOCRResult(
            page_number=page_number,
            text=full_text,
            lines=lines,
            confidence=avg_confidence,
        )
