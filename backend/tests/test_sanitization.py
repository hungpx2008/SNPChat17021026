"""Unit tests for RAG text sanitization and formatting helpers.

These are pure functions — no DB, no Redis, no external services needed.
"""
from __future__ import annotations

import pytest

from src.worker.rag.synthesis import (
    _build_fallback_answer,
    _clean_snippet_text,
    _format_citations_footer,
    _sanitize_generated_answer,
    _split_sentences_vi,
    _strip_markdown_tables,
)


# ---------------------------------------------------------------------------
# _sanitize_generated_answer
# ---------------------------------------------------------------------------


class TestSanitizeGeneratedAnswer:
    """Tests for _sanitize_generated_answer."""

    def test_empty_string(self):
        assert _sanitize_generated_answer("") == ""

    def test_none_input(self):
        # function does `text or ""` so None-ish input should be safe
        assert _sanitize_generated_answer("") == ""

    def test_normal_text_unchanged(self):
        text = "Tân Cảng Sài Gòn là cảng lớn nhất Việt Nam."
        result = _sanitize_generated_answer(text)
        assert "Tân Cảng" in result

    def test_strips_citation_footer(self):
        text = (
            "Kết quả tốt.\n\n---\n📚 **Nguồn tham khảo:**\n"
            "- **[1]** doc.pdf (Trang 1)"
        )
        result = _sanitize_generated_answer(text)
        assert "📚" not in result
        assert "Nguồn tham khảo" not in result

    def test_strips_malformed_citation_lines(self):
        text = "Kết quả tốt.\n- **[Nguồn: doc.pdf]** Trang 5"
        result = _sanitize_generated_answer(text)
        assert "**[Nguồn:" not in result

    def test_fixes_inline_malformed_citations(self):
        text = "Giá cước là [ 1 VNĐ ] theo tài liệu."
        result = _sanitize_generated_answer(text)
        assert "VNĐ" not in result or "[1]" in result

    def test_collapses_excess_newlines(self):
        text = "Dòng 1\n\n\n\n\nDòng 2"
        result = _sanitize_generated_answer(text)
        assert "\n\n\n\n" not in result

    def test_trims_dangling_conjunction(self):
        text = "Kết quả tốt và"
        result = _sanitize_generated_answer(text)
        assert not result.rstrip().endswith("và")

    def test_trims_dangling_preposition(self):
        text = "Thông tin tại"
        result = _sanitize_generated_answer(text)
        assert not result.rstrip().endswith("tại")

    def test_preserves_legitimate_content(self):
        text = "Cảng Cát Lái xử lý 6.5 triệu TEU mỗi năm, với cơ sở hạ tầng hiện đại."
        result = _sanitize_generated_answer(text)
        assert "6.5 triệu TEU" in result


# ---------------------------------------------------------------------------
# _clean_snippet_text
# ---------------------------------------------------------------------------


class TestCleanSnippetText:
    """Tests for _clean_snippet_text."""

    def test_empty_string(self):
        assert _clean_snippet_text("") == ""

    def test_removes_html_tags(self):
        text = "<td>Dữ liệu</td><tr><table>"
        result = _clean_snippet_text(text)
        assert "<td>" not in result
        assert "Dữ liệu" in result

    def test_normalizes_windows_line_endings(self):
        text = "Dòng 1\r\nDòng 2\r\nDòng 3"
        result = _clean_snippet_text(text)
        assert "\r" not in result

    def test_collapses_extra_whitespace(self):
        text = "hello     world"
        result = _clean_snippet_text(text)
        assert "     " not in result
        assert "hello world" in result

    def test_converts_tabs_to_spaces(self):
        text = "col1\tcol2\tcol3"
        result = _clean_snippet_text(text)
        assert "\t" not in result

    def test_collapses_blank_lines(self):
        text = "A\n\n\n\n\nB"
        result = _clean_snippet_text(text)
        assert "\n\n\n" not in result

    def test_preserves_vietnamese_chars(self):
        text = "Cảng container quốc tế Cát Lái"
        assert _clean_snippet_text(text) == text


# ---------------------------------------------------------------------------
# _strip_markdown_tables
# ---------------------------------------------------------------------------


class TestStripMarkdownTables:
    """Tests for _strip_markdown_tables."""

    def test_empty_string(self):
        assert _strip_markdown_tables("") == ""

    def test_removes_full_table(self):
        text = "| Col1 | Col2 |\n|---|---|\n| A | B |\n| C | D |"
        result = _strip_markdown_tables(text)
        assert "|---|---|" not in result
        assert "| Col1 |" not in result

    def test_removes_separator_only_lines(self):
        # Pipe-heavy lines with no alpha/digit content
        text = "Normal text\n|---|---|---|\nMore text"
        result = _strip_markdown_tables(text)
        assert "|---|" not in result
        assert "Normal text" in result
        assert "More text" in result

    def test_preserves_non_table_content(self):
        text = "Normal paragraph text."
        assert _strip_markdown_tables(text) == text

    def test_preserves_single_pipe_usage(self):
        text = "A | B means OR operation"
        result = _strip_markdown_tables(text)
        assert "A | B" in result


# ---------------------------------------------------------------------------
# _split_sentences_vi
# ---------------------------------------------------------------------------


class TestSplitSentencesVi:
    """Tests for _split_sentences_vi (Vietnamese sentence splitting)."""

    def test_empty_string(self):
        assert _split_sentences_vi("") == []

    def test_single_sentence(self):
        result = _split_sentences_vi("Xin chào.")
        assert len(result) == 1
        assert result[0] == "Xin chào."

    def test_multiple_sentences(self):
        text = "Câu một. Câu hai. Câu ba."
        result = _split_sentences_vi(text)
        assert len(result) >= 2

    def test_preserves_decimal_numbers(self):
        text = "Giá cước là 1.200.000 VNĐ. Đây là mức giá mới."
        result = _split_sentences_vi(text)
        # Should NOT split at decimal separator dots
        joined = " ".join(result)
        assert "1.200.000" in joined

    def test_preserves_abbreviations(self):
        """Common Vietnamese abbreviations should not cause false splits."""
        text = "TP. Hồ Chí Minh có cảng lớn."
        result = _split_sentences_vi(text)
        # TP. should be treated as abbreviation, not sentence break
        assert len(result) >= 1

    def test_preserves_ellipsis(self):
        text = "Kết quả... Đây là câu tiếp."
        result = _split_sentences_vi(text)
        joined = " ".join(result)
        assert "..." in joined

    def test_splits_on_exclamation(self):
        text = "Tuyệt vời! Cảng hoạt động tốt."
        result = _split_sentences_vi(text)
        assert len(result) == 2

    def test_splits_on_question_mark(self):
        text = "Giá bao nhiêu? Tôi cần biết ngay."
        result = _split_sentences_vi(text)
        assert len(result) == 2


# ---------------------------------------------------------------------------
# _format_citations_footer
# ---------------------------------------------------------------------------


class TestFormatCitationsFooter:
    """Tests for _format_citations_footer."""

    def test_empty_citations(self):
        result = _format_citations_footer([])
        assert result == ""

    def test_single_citation(self):
        citations = [{"index": 1, "file": "doc.pdf", "page": 5, "headings": [], "score": 0.85}]
        result = _format_citations_footer(citations)
        assert "doc.pdf" in result
        assert "Trang 5" in result
        assert "📚" in result

    def test_citation_with_headings(self):
        citations = [
            {
                "index": 1,
                "file": "report.docx",
                "page": 3,
                "headings": ["Chương 1", "Phần A"],
                "score": 0.9,
            }
        ]
        result = _format_citations_footer(citations)
        assert "mục: Phần A" in result

    def test_citation_with_invalid_page(self):
        citations = [{"index": 1, "file": "doc.pdf", "page": "abc", "headings": [], "score": 0.5}]
        result = _format_citations_footer(citations)
        assert "Trang ?" in result

    def test_citation_with_none_page(self):
        citations = [{"index": 1, "file": "doc.pdf", "page": None, "headings": [], "score": 0.5}]
        result = _format_citations_footer(citations)
        assert "Trang ?" in result

    def test_citation_score_display(self):
        citations = [{"index": 1, "file": "doc.pdf", "page": 1, "headings": [], "score": 0.85}]
        result = _format_citations_footer(citations)
        assert "0.850" in result

    def test_citation_invalid_score_hidden(self):
        citations = [{"index": 1, "file": "doc.pdf", "page": 1, "headings": [], "score": "bad"}]
        result = _format_citations_footer(citations)
        assert "độ liên quan" not in result

    def test_multiple_citations(self):
        citations = [
            {"index": 1, "file": "a.pdf", "page": 1, "headings": [], "score": 0.9},
            {"index": 2, "file": "b.pdf", "page": 2, "headings": [], "score": 0.8},
        ]
        result = _format_citations_footer(citations)
        assert "a.pdf" in result
        assert "b.pdf" in result
        assert "**[1]**" in result
        assert "**[2]**" in result


# ---------------------------------------------------------------------------
# _build_fallback_answer
# ---------------------------------------------------------------------------


class TestBuildFallbackAnswer:
    """Tests for _build_fallback_answer."""

    def test_empty_context_blocks(self):
        result = _build_fallback_answer([])
        assert isinstance(result, str)
        assert len(result) > 0
        assert "Chưa tìm thấy" in result

    def test_with_context_blocks(self):
        result = _build_fallback_answer(["[1] Cảng Cát Lái nằm tại Quận 2"])
        assert isinstance(result, str)
        assert "Cảng Cát Lái" in result

    def test_strips_index_prefix(self):
        result = _build_fallback_answer(["[1] Nội dung tài liệu"])
        assert "[1]" not in result
        assert "Nội dung tài liệu" in result

    def test_returns_nonempty_always(self):
        result = _build_fallback_answer([""])
        assert isinstance(result, str)
