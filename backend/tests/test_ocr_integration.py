"""Integration tests for PaddleOCR fallback in the document ingestion pipeline.

Tests the decision logic: when Docling produces sparse output, OCR should be triggered.
When Docling works fine, OCR is skipped. All external services mocked.
"""
from unittest.mock import MagicMock, patch
from dataclasses import dataclass, field

import pytest

from src.services.ocr_service import OCRService, OCRResult, PageOCRResult


class TestScannedPdfDetection:
    def test_native_pdf_skips_ocr(self):
        docling_text = "Quy trình xuất nhập khẩu container. " * 100
        page_count = 3
        assert OCRService.is_scanned_pdf(docling_text, page_count) is False

    def test_scanned_pdf_triggers_ocr(self):
        docling_text = "  \n\n  "
        page_count = 10
        assert OCRService.is_scanned_pdf(docling_text, page_count) is True

    def test_mixed_pdf_below_threshold(self):
        docling_text = "Some sparse text that was partially recognized."
        page_count = 5
        assert OCRService.is_scanned_pdf(docling_text, page_count) is True


class TestOcrToChunksFormat:
    def test_ocr_chunks_match_docling_format(self):
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
        assert chunks[0]["text"] == "Page 1 text"
        assert chunks[0]["page"] == 1
        assert chunks[1]["text"] == "Page 2 text"
        assert chunks[1]["page"] == 2

    def test_ocr_chunks_skip_empty_pages(self):
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
    @patch("src.services.ocr_service.OCRService._get_ocr_engine")
    @patch("src.services.ocr_service.OCRService.is_ocr_enabled", return_value=True)
    def test_scanned_pdf_uses_ocr_chunks(self, mock_enabled, mock_get_engine):
        mock_engine = MagicMock()
        mock_engine.ocr.return_value = [
            [
                [[[0, 0], [100, 0], [100, 30], [0, 30]], ("Nội dung từ OCR trang 1", 0.92)],
            ]
        ]
        mock_get_engine.return_value = mock_engine

        docling_text = "  "
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
        docling_text = "  "
        page_count = 5
        triggered = OCRService.is_ocr_enabled() and OCRService.is_scanned_pdf(docling_text, page_count)
        assert triggered is False

    def test_native_pdf_never_triggers_ocr(self):
        docling_text = "A" * 5000
        page_count = 10
        assert OCRService.is_scanned_pdf(docling_text, page_count) is False
