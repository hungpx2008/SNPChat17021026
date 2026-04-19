# Phase 9: PaddleOCR Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add PaddleOCR as a fallback extractor for scanned PDFs and photographed documents that Docling cannot read, so text from image-based PDFs becomes searchable in the RAG pipeline.

**Architecture:** After Docling processing, a heuristic checks if the extracted text is suspiciously sparse (< 100 chars/page average). If so, the PDF pages are rendered to images via `pdf2image` at 300 DPI, then PaddleOCR extracts Vietnamese text per page. OCR output is formatted as `prechunked_chunks` (same dict structure as Docling chunks: `text`, `page`, `headings`, `row_keys`) so it flows through the existing parent-child chunking pipeline unchanged. For standalone images (.jpg/.png), OCR text is extracted alongside the existing VLM description.

**Tech Stack:** PaddleOCR (Vietnamese lang), PaddlePaddle (inference engine), pdf2image + poppler-utils (PDF rendering), Docker volume for cached OCR models (~200MB).

**Spec:** `docs/superpowers/specs/2026-04-13-eon-gap-techniques-design.md` — Phase 9 section.

---

### Task 1: OCRService Class

**Files:**
- Create: `chatSNP170226/backend/src/services/ocr_service.py`
- Test: `chatSNP170226/backend/tests/test_ocr_service.py`

- [ ] **Step 1: Write the tests for OCRService**

Create `chatSNP170226/backend/tests/test_ocr_service.py`:

```python
"""Tests for OCRService — PaddleOCR wrapper for Vietnamese text extraction."""
from unittest.mock import MagicMock, patch, PropertyMock
import pytest

from src.services.ocr_service import OCRService, OCRResult, PageOCRResult


# ── is_scanned_pdf heuristic tests ─────────────────────────────────────


class TestIsScannedPdf:
    """Test the scanned-PDF detection heuristic."""

    def test_empty_text_is_scanned(self):
        """Empty Docling output → definitely scanned."""
        assert OCRService.is_scanned_pdf(
            extracted_text="",
            page_count=5,
        ) is True

    def test_very_sparse_text_is_scanned(self):
        """< 100 chars/page average → scanned."""
        # 10 pages, only 50 total chars → 5 chars/page
        text = "x" * 50
        assert OCRService.is_scanned_pdf(
            extracted_text=text,
            page_count=10,
        ) is True

    def test_rich_text_is_not_scanned(self):
        """Well above 100 chars/page → native PDF."""
        # 5 pages, 2000 total chars → 400 chars/page
        text = "Quy trình xuất nhập khẩu container qua cảng Cát Lái. " * 40
        assert OCRService.is_scanned_pdf(
            extracted_text=text,
            page_count=5,
        ) is False

    def test_exactly_threshold_is_not_scanned(self):
        """Exactly 100 chars/page → borderline, treat as native."""
        text = "a" * 300
        assert OCRService.is_scanned_pdf(
            extracted_text=text,
            page_count=3,
        ) is False

    def test_zero_pages_returns_false(self):
        """Edge case: 0 pages should not crash, return False."""
        assert OCRService.is_scanned_pdf(
            extracted_text="some text",
            page_count=0,
        ) is False

    def test_custom_threshold(self):
        """Custom min_chars_per_page threshold."""
        text = "a" * 150  # 3 pages → 50 chars/page
        # With default threshold (100) → scanned
        assert OCRService.is_scanned_pdf(text, 3) is True
        # With lower threshold (40) → not scanned
        assert OCRService.is_scanned_pdf(text, 3, min_chars_per_page=40) is False


# ── OCR extraction tests (mocked PaddleOCR) ────────────────────────────


class TestExtractFromImage:
    """Test single-image OCR extraction with mocked PaddleOCR."""

    @patch("src.services.ocr_service.OCRService._get_ocr_engine")
    def test_extract_from_image_returns_text(self, mock_get_engine):
        """OCR should return extracted text from image."""
        mock_engine = MagicMock()
        # PaddleOCR returns: list of [list of [bbox, (text, confidence)]]
        mock_engine.ocr.return_value = [
            [
                [[[0, 0], [100, 0], [100, 30], [0, 30]], ("Biểu giá container", 0.95)],
                [[[0, 40], [200, 40], [200, 70], [0, 70]], ("20ft tại cảng Cát Lái", 0.88)],
            ]
        ]
        mock_get_engine.return_value = mock_engine

        service = OCRService()
        result = service.extract_from_image("/fake/image.png")

        assert isinstance(result, OCRResult)
        assert "Biểu giá container" in result.text
        assert "20ft tại cảng Cát Lái" in result.text
        assert len(result.pages) == 1
        assert result.pages[0].page_number == 1
        assert result.confidence > 0.5

    @patch("src.services.ocr_service.OCRService._get_ocr_engine")
    def test_extract_from_image_filters_low_confidence(self, mock_get_engine):
        """Lines below CONFIDENCE_THRESHOLD should be excluded."""
        mock_engine = MagicMock()
        mock_engine.ocr.return_value = [
            [
                [[[0, 0], [100, 0], [100, 30], [0, 30]], ("Good text", 0.90)],
                [[[0, 40], [200, 40], [200, 70], [0, 70]], ("Garbled noise", 0.20)],
            ]
        ]
        mock_get_engine.return_value = mock_engine

        service = OCRService()
        result = service.extract_from_image("/fake/image.png")

        assert "Good text" in result.text
        assert "Garbled noise" not in result.text

    @patch("src.services.ocr_service.OCRService._get_ocr_engine")
    def test_extract_from_image_empty_result(self, mock_get_engine):
        """Empty OCR result → empty text, zero confidence."""
        mock_engine = MagicMock()
        mock_engine.ocr.return_value = [[]]
        mock_get_engine.return_value = mock_engine

        service = OCRService()
        result = service.extract_from_image("/fake/blank.png")

        assert result.text == ""
        assert result.confidence == 0.0
        assert len(result.pages) == 1

    @patch("src.services.ocr_service.OCRService._get_ocr_engine")
    def test_extract_from_image_none_result(self, mock_get_engine):
        """PaddleOCR returning None → graceful empty result."""
        mock_engine = MagicMock()
        mock_engine.ocr.return_value = [None]
        mock_get_engine.return_value = mock_engine

        service = OCRService()
        result = service.extract_from_image("/fake/corrupt.png")

        assert result.text == ""
        assert result.confidence == 0.0


class TestExtractFromPdf:
    """Test PDF OCR extraction with mocked pdf2image + PaddleOCR."""

    @patch("src.services.ocr_service.convert_from_path")
    @patch("src.services.ocr_service.OCRService._get_ocr_engine")
    def test_extract_from_pdf_multi_page(self, mock_get_engine, mock_convert):
        """Multi-page PDF should return per-page OCR results."""
        # Mock pdf2image: 2 pages as PIL images
        mock_img1 = MagicMock()
        mock_img1.save = MagicMock()
        mock_img2 = MagicMock()
        mock_img2.save = MagicMock()
        mock_convert.return_value = [mock_img1, mock_img2]

        # Mock PaddleOCR engine
        mock_engine = MagicMock()
        mock_engine.ocr.side_effect = [
            [[  # Page 1
                [[[0, 0], [100, 0], [100, 30], [0, 30]], ("Trang 1 nội dung", 0.92)],
            ]],
            [[  # Page 2
                [[[0, 0], [100, 0], [100, 30], [0, 30]], ("Trang 2 nội dung", 0.89)],
            ]],
        ]
        mock_get_engine.return_value = mock_engine

        service = OCRService()
        result = service.extract_from_pdf("/fake/scanned.pdf")

        assert isinstance(result, OCRResult)
        assert "Trang 1 nội dung" in result.text
        assert "Trang 2 nội dung" in result.text
        assert len(result.pages) == 2
        assert result.pages[0].page_number == 1
        assert result.pages[1].page_number == 2
        assert result.confidence > 0.5

    @patch("src.services.ocr_service.convert_from_path")
    @patch("src.services.ocr_service.OCRService._get_ocr_engine")
    def test_extract_from_pdf_empty_pages(self, mock_get_engine, mock_convert):
        """PDF with blank pages → empty text, zero confidence."""
        mock_img = MagicMock()
        mock_img.save = MagicMock()
        mock_convert.return_value = [mock_img]

        mock_engine = MagicMock()
        mock_engine.ocr.return_value = [[]]
        mock_get_engine.return_value = mock_engine

        service = OCRService()
        result = service.extract_from_pdf("/fake/blank.pdf")

        assert result.text == ""
        assert len(result.pages) == 1


class TestOcrChunksFormat:
    """Test that OCR output can be formatted as prechunked_chunks."""

    @patch("src.services.ocr_service.OCRService._get_ocr_engine")
    def test_to_prechunked_chunks_format(self, mock_get_engine):
        """to_prechunked_chunks should return Docling-compatible chunk dicts."""
        mock_engine = MagicMock()
        mock_engine.ocr.return_value = [
            [
                [[[0, 0], [100, 0], [100, 30], [0, 30]], ("Nội dung trang OCR", 0.90)],
            ]
        ]
        mock_get_engine.return_value = mock_engine

        service = OCRService()
        result = service.extract_from_image("/fake/image.png")
        chunks = OCRService.to_prechunked_chunks(result)

        assert len(chunks) >= 1
        chunk = chunks[0]
        # Must match Docling chunk format
        assert "text" in chunk
        assert "page" in chunk
        assert "headings" in chunk
        assert "row_keys" in chunk
        assert isinstance(chunk["text"], str)
        assert isinstance(chunk["page"], int)
        assert isinstance(chunk["headings"], list)
        assert isinstance(chunk["row_keys"], list)
        assert chunk["text"] == "Nội dung trang OCR"
        assert chunk["page"] == 1
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_ocr_service.py -v`
Expected: FAIL — `ocr_service` module not found

- [ ] **Step 3: Implement OCRService**

Create `chatSNP170226/backend/src/services/ocr_service.py`:

```python
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_ocr_service.py -v`
Expected: PASS (all tests)

- [ ] **Step 5: Commit**

```bash
git add chatSNP170226/backend/src/services/ocr_service.py chatSNP170226/backend/tests/test_ocr_service.py
git commit -m "feat(ocr): add OCRService with PaddleOCR for Vietnamese text extraction"
```

---

### Task 2: Docker & Dependency Configuration

**Files:**
- Modify: `chatSNP170226/backend/pyproject.toml`
- Modify: `chatSNP170226/backend/Dockerfile`
- Modify: `chatSNP170226/docker-compose.yml`

- [ ] **Step 1: Add Python dependencies to pyproject.toml**

In `chatSNP170226/backend/pyproject.toml`, add the following 3 lines to the `dependencies` list, after the `"faster-whisper>=1.0.0"` line (in the AI / ML Services section):

```toml
    # OCR for scanned documents (Phase 9)
    "paddleocr>=2.7",
    "paddlepaddle>=2.6",
    "pdf2image>=1.16",
```

- [ ] **Step 2: Add poppler-utils to Dockerfile**

In `chatSNP170226/backend/Dockerfile`, add `poppler-utils` to the existing `apt-get install` line. Find:

```dockerfile
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    ffmpeg \
    # Dependencies for OpenCV/docling pipelines (cv2 needs X11/GL libs)
    libreoffice \
    libxcb1 \
    libxext6 \
    libxrender1 \
    libsm6 \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*
```

Replace with:

```dockerfile
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    ffmpeg \
    # Dependencies for OpenCV/docling pipelines (cv2 needs X11/GL libs)
    libreoffice \
    libxcb1 \
    libxext6 \
    libxrender1 \
    libsm6 \
    libgl1 \
    libglib2.0-0 \
    # PDF-to-image conversion for PaddleOCR (Phase 9)
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*
```

- [ ] **Step 3: Add paddle_models volume to docker-compose.yml**

In `chatSNP170226/docker-compose.yml`, make two changes:

**3a.** Add `ENABLE_PADDLE_OCR` env var to `x-common-env` anchor (after `DOCLING_GROUP_LOCK_MAX_CHARS`):

```yaml
  # PaddleOCR for scanned documents (Phase 9)
  ENABLE_PADDLE_OCR: ${ENABLE_PADDLE_OCR:-false}
```

**3b.** Add `paddle-models` volume to the `worker_media` service (it's the only service that runs document processing). Find the `worker_media` volumes section:

```yaml
  worker_media:
    ...
    volumes:
      - ./backend:/app
      - media-data:/app/media
      - whoosh-index:/data/whoosh_index
```

Add the paddle models volume:

```yaml
  worker_media:
    ...
    volumes:
      - ./backend:/app
      - media-data:/app/media
      - whoosh-index:/data/whoosh_index
      - paddle-models:/root/.paddleocr
```

**3c.** Add `paddle-models` to the top-level `volumes` section at the bottom of docker-compose.yml:

```yaml
volumes:
  postgres-data:
  redis-data:
  qdrant-data:
  huggingface-cache:
  media-data:
  whoosh-index:
  paddle-models:
```

- [ ] **Step 4: Verify YAML syntax is valid**

Run: `cd chatSNP170226 && python -c "import yaml; yaml.safe_load(open('docker-compose.yml')); print('YAML OK')"`

- [ ] **Step 5: Commit**

```bash
git add chatSNP170226/backend/pyproject.toml chatSNP170226/backend/Dockerfile chatSNP170226/docker-compose.yml
git commit -m "feat(docker): add PaddleOCR dependencies, poppler-utils, and model cache volume"
```

---

### Task 3: Integrate OCR Fallback into PDF Ingestion Pipeline

**Files:**
- Modify: `chatSNP170226/backend/src/worker/media_tasks.py`

This is the core integration task. After Docling processes a PDF, if the result looks like a scanned document, OCR takes over and produces `prechunked_chunks` that flow through the existing parent-child pipeline.

- [ ] **Step 1: Add OCR fallback after Docling processing in process_document**

In `chatSNP170226/backend/src/worker/media_tasks.py`, find the section in `process_document()` where Docling processing completes and `prechunked_chunks` are built (around line 92-122). After the `logger.info(f"[process] Docling done: ...")` line, add the OCR fallback check.

Find this block (lines ~92-122):

```python
        else:
            # PPTX → convert to PDF for preview (parallel to Docling processing)
            if ext in (".pptx", ".ppt"):
                # ... PPTX conversion code ...

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
```

Replace with:

```python
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
```

- [ ] **Step 2: Update extractor_used to reflect OCR when used**

In the same `process_document()` function, find the line that calls `_do_full_processing` (around line 126). Change the `extractor_used` parameter to detect when OCR was used:

Find:

```python
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
```

Replace with:

```python
        # Determine extractor used
        if ext in (".jpg", ".jpeg", ".png"):
            _extractor = "vlm"
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
```

- [ ] **Step 3: Commit**

```bash
git add chatSNP170226/backend/src/worker/media_tasks.py
git commit -m "feat(ingestion): add PaddleOCR fallback for scanned PDFs in process_document"
```

---

### Task 4: Add OCR for Standalone Images (Alongside VLM)

**Files:**
- Modify: `chatSNP170226/backend/src/worker/media_tasks.py`

For standalone image uploads (.jpg, .png), PaddleOCR extracts any visible text (e.g., photographed documents, receipts, form scans). The existing VLM visual description is kept as supplementary context.

- [ ] **Step 1: Enhance Branch A (Images → VLM) with OCR text**

In `chatSNP170226/backend/src/worker/media_tasks.py`, find the image branch in `process_document()` (around line 65-71):

```python
        # --- Branch A: Images → VLM ---
        if ext in (".jpg", ".jpeg", ".png"):
            logger.info(f"[process] Image file detected → calling VLM")
            from src.worker.helpers import _extract_text_from_image
            extracted_text = _extract_text_from_image(file_path)
            page_count = 1
            table_count = 0
            deep_meta = {"extractor": "vlm", "vlm_model": os.getenv("LLM_MODEL", "gpt-4o-mini")}
```

Replace with:

```python
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
```

- [ ] **Step 2: Commit**

```bash
git add chatSNP170226/backend/src/worker/media_tasks.py
git commit -m "feat(ingestion): add OCR text extraction for standalone image uploads"
```

---

### Task 5: Tests — Integration & Regression

**Files:**
- Create: `chatSNP170226/backend/tests/test_ocr_integration.py`

- [ ] **Step 1: Write integration tests for the OCR fallback flow**

Create `chatSNP170226/backend/tests/test_ocr_integration.py`:

```python
"""Integration tests for PaddleOCR fallback in the document ingestion pipeline.

Tests the decision logic in process_document: when Docling produces sparse
output, OCR should be triggered. When Docling works fine, OCR is skipped.

All external services (PaddleOCR, Docling, Qdrant, Mem0) are mocked.
"""
from unittest.mock import MagicMock, patch
from dataclasses import dataclass, field

import pytest

from src.services.ocr_service import OCRService, OCRResult, PageOCRResult


# ── Scanned PDF detection integration ───────────────────────────────────


class TestScannedPdfDetection:
    """Test the full decision path: Docling output → scanned check → OCR."""

    def test_native_pdf_skips_ocr(self):
        """Native PDF with rich text should NOT trigger OCR."""
        # Simulate Docling returning 500 chars/page
        docling_text = "Quy trình xuất nhập khẩu container. " * 100
        page_count = 3  # ~1200 chars / 3 pages = 400 chars/page

        assert OCRService.is_scanned_pdf(docling_text, page_count) is False

    def test_scanned_pdf_triggers_ocr(self):
        """Scanned PDF with sparse text should trigger OCR."""
        # Simulate Docling returning only whitespace/noise from scanned images
        docling_text = "  \n\n  "
        page_count = 10  # ~5 chars / 10 pages = 0.5 chars/page

        assert OCRService.is_scanned_pdf(docling_text, page_count) is True

    def test_mixed_pdf_below_threshold(self):
        """PDF with some text but below threshold → scanned."""
        # 50 chars / 5 pages = 10 chars/page (< 100 threshold)
        docling_text = "Some sparse text that was partially recognized."
        page_count = 5

        assert OCRService.is_scanned_pdf(docling_text, page_count) is True


class TestOcrToChunksFormat:
    """Test that OCR output matches Docling chunk format for pipeline compat."""

    def test_ocr_chunks_match_docling_format(self):
        """OCR chunks must have: text, page, headings, row_keys."""
        ocr_result = OCRResult(
            text="Page 1 text\n\nPage 2 text",
            pages=[
                PageOCRResult(page_number=1, text="Page 1 text", confidence=0.9),
                PageOCRResult(page_number=2, text="Page 2 text", confidence=0.85),
            ],
            confidence=0.875,
        )

        chunks = OCRService.to_prechunked_chunks(ocr_result)

        assert len(chunks) == 2
        for chunk in chunks:
            assert set(chunk.keys()) == {"text", "page", "headings", "row_keys"}
            assert isinstance(chunk["text"], str)
            assert isinstance(chunk["page"], int)
            assert isinstance(chunk["headings"], list)
            assert isinstance(chunk["row_keys"], list)

        assert chunks[0]["text"] == "Page 1 text"
        assert chunks[0]["page"] == 1
        assert chunks[1]["text"] == "Page 2 text"
        assert chunks[1]["page"] == 2

    def test_ocr_chunks_skip_empty_pages(self):
        """Pages with no OCR text should not produce chunks."""
        ocr_result = OCRResult(
            text="Only page 1",
            pages=[
                PageOCRResult(page_number=1, text="Only page 1", confidence=0.9),
                PageOCRResult(page_number=2, text="", confidence=0.0),
                PageOCRResult(page_number=3, text="   ", confidence=0.1),
            ],
            confidence=0.5,
        )

        chunks = OCRService.to_prechunked_chunks(ocr_result)
        assert len(chunks) == 1
        assert chunks[0]["page"] == 1


class TestOcrEnabledGate:
    """Test ENABLE_PADDLE_OCR environment variable gating."""

    @patch.dict("os.environ", {"ENABLE_PADDLE_OCR": "true"})
    def test_enabled_when_true(self):
        assert OCRService.is_ocr_enabled() is True

    @patch.dict("os.environ", {"ENABLE_PADDLE_OCR": "1"})
    def test_enabled_when_one(self):
        assert OCRService.is_ocr_enabled() is True

    @patch.dict("os.environ", {"ENABLE_PADDLE_OCR": "false"})
    def test_disabled_when_false(self):
        assert OCRService.is_ocr_enabled() is False

    @patch.dict("os.environ", {}, clear=True)
    def test_disabled_by_default(self):
        assert OCRService.is_ocr_enabled() is False

    @patch.dict("os.environ", {"ENABLE_PADDLE_OCR": "yes"})
    def test_enabled_when_yes(self):
        assert OCRService.is_ocr_enabled() is True


class TestOcrFallbackInPipeline:
    """Test the OCR fallback decision as it would happen in process_document."""

    @patch("src.services.ocr_service.OCRService._get_ocr_engine")
    @patch("src.services.ocr_service.OCRService.is_ocr_enabled", return_value=True)
    def test_scanned_pdf_uses_ocr_chunks(self, mock_enabled, mock_get_engine):
        """When Docling returns sparse text and OCR is enabled, OCR chunks replace Docling's."""
        # Setup mock OCR engine
        mock_engine = MagicMock()
        mock_engine.ocr.return_value = [
            [
                [[[0, 0], [100, 0], [100, 30], [0, 30]], ("Nội dung từ OCR trang 1", 0.92)],
            ]
        ]
        mock_get_engine.return_value = mock_engine

        # Simulate the decision flow from process_document
        docling_text = "  "  # Sparse — scanned PDF
        page_count = 5

        if OCRService.is_ocr_enabled() and OCRService.is_scanned_pdf(docling_text, page_count):
            ocr_service = OCRService()
            ocr_result = ocr_service.extract_from_image("/fake/page.png")

            if ocr_result.text.strip():
                chunks = OCRService.to_prechunked_chunks(ocr_result)
                assert len(chunks) >= 1
                assert chunks[0]["text"] == "Nội dung từ OCR trang 1"
                return

        pytest.fail("OCR fallback should have been triggered")

    @patch("src.services.ocr_service.OCRService.is_ocr_enabled", return_value=False)
    def test_scanned_pdf_skips_ocr_when_disabled(self, mock_enabled):
        """When OCR is disabled, scanned PDFs should NOT trigger OCR."""
        docling_text = "  "
        page_count = 5

        triggered = (
            OCRService.is_ocr_enabled()
            and OCRService.is_scanned_pdf(docling_text, page_count)
        )
        assert triggered is False

    def test_native_pdf_never_triggers_ocr(self):
        """Native PDF with good Docling output should never reach OCR."""
        docling_text = "A" * 5000  # Rich text
        page_count = 10  # 500 chars/page

        assert OCRService.is_scanned_pdf(docling_text, page_count) is False
```

- [ ] **Step 2: Run all OCR tests together**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_ocr_service.py tests/test_ocr_integration.py -v`
Expected: All PASS

- [ ] **Step 3: Run existing tests to check for regressions**

Run: `cd chatSNP170226/backend && python -m pytest tests/ -v --tb=short 2>&1 | tail -30`
Expected: No new failures introduced

- [ ] **Step 4: Commit**

```bash
git add chatSNP170226/backend/tests/test_ocr_integration.py
git commit -m "test: add integration and regression tests for PaddleOCR fallback"
```

---

### Task 6: Run Full Test Suite and Verify

- [ ] **Step 1: Run all Phase 9 tests together**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_ocr_service.py tests/test_ocr_integration.py -v`
Expected: All PASS

- [ ] **Step 2: Run the complete test suite for regressions**

Run: `cd chatSNP170226/backend && python -m pytest tests/ -v --tb=short 2>&1 | tail -30`
Expected: No new failures introduced

- [ ] **Step 3: Verify Docker configuration syntax**

Run:
```bash
cd chatSNP170226
python -c "import yaml; yaml.safe_load(open('docker-compose.yml')); print('docker-compose.yml OK')"
cd backend && python -c "
import tomllib
with open('pyproject.toml', 'rb') as f:
    data = tomllib.load(f)
    deps = data['project']['dependencies']
    assert any('paddleocr' in d for d in deps), 'paddleocr not in deps'
    assert any('paddlepaddle' in d for d in deps), 'paddlepaddle not in deps'
    assert any('pdf2image' in d for d in deps), 'pdf2image not in deps'
    print('pyproject.toml OK — all OCR deps present')
"
```
Expected: Both OK

- [ ] **Step 4: Verify OCRService module imports cleanly**

Run: `cd chatSNP170226/backend && python -c "from src.services.ocr_service import OCRService, OCRResult, PageOCRResult; print('OCRService imports OK')"`
Expected: `OCRService imports OK` (PaddleOCR itself is NOT imported at module level — only on first use)

- [ ] **Step 5: Final commit tagging Phase 9 complete**

```bash
git commit --allow-empty -m "milestone: Phase 9 PaddleOCR Integration complete"
```
