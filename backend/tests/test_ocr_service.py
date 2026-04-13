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
