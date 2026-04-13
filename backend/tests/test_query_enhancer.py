"""Tests for QueryEnhancer — strategy classification and enhancement."""
import json
from unittest.mock import patch, MagicMock

import pytest

from src.services.search.query_enhancer import (
    QueryEnhancer,
    EnhancedQuery,
    QueryStrategy,
    HYDE_MIN_TOKENS,
    DECOMPOSE_SIGNALS_VI,
)


class TestClassifyStrategy:
    """Tests for _classify_strategy() heuristic."""

    def test_short_query_returns_direct(self):
        """Queries shorter than HYDE_MIN_TOKENS should use DIRECT strategy."""
        enhancer = QueryEnhancer()
        # Short query: "biểu giá container" ≈ 5 words × 1.8 = 9 tokens
        assert enhancer._classify_strategy("biểu giá container") == QueryStrategy.DIRECT

    def test_single_word_returns_direct(self):
        """Single word queries should use DIRECT."""
        enhancer = QueryEnhancer()
        assert enhancer._classify_strategy("logistics") == QueryStrategy.DIRECT

    def test_comparison_query_returns_decomposed(self):
        """Queries with comparison signals should use DECOMPOSED."""
        enhancer = QueryEnhancer()
        # Long enough (> 30 tokens) + contains "so sánh"
        query = "so sánh biểu giá dịch vụ container 20ft và 40ft tại cảng Cát Lái và cảng Hiệp Phước trong năm 2025"
        result = enhancer._classify_strategy(query)
        assert result == QueryStrategy.DECOMPOSED

    def test_multi_part_query_returns_decomposed(self):
        """Queries with 'khác nhau' signal should use DECOMPOSED."""
        enhancer = QueryEnhancer()
        query = "quy trình nhập khẩu và xuất khẩu hàng đông lạnh khác nhau như thế nào tại cảng Cát Lái và cảng Hiệp Phước"
        result = enhancer._classify_strategy(query)
        assert result == QueryStrategy.DECOMPOSED

    def test_long_query_without_signals_returns_hyde(self):
        """Long queries without decomposition signals should use HYDE."""
        enhancer = QueryEnhancer()
        query = (
            "Tôi muốn biết quy trình xuất khẩu hàng đông lạnh qua cảng Cát Lái "
            "gồm những bước nào, cần giấy tờ gì, thời gian xử lý bao lâu"
        )
        result = enhancer._classify_strategy(query)
        assert result == QueryStrategy.HYDE

    def test_short_query_with_signal_still_direct(self):
        """Short queries with signals should still be DIRECT (token check first)."""
        enhancer = QueryEnhancer()
        # "so sánh giá" = 5 words × 1.8 = 9 tokens < 30
        assert enhancer._classify_strategy("so sánh giá") == QueryStrategy.DIRECT

    def test_empty_query_returns_direct(self):
        """Empty query should return DIRECT."""
        enhancer = QueryEnhancer()
        assert enhancer._classify_strategy("") == QueryStrategy.DIRECT
        assert enhancer._classify_strategy("   ") == QueryStrategy.DIRECT

    def test_giua_signal_triggers_decomposed(self):
        """Query with 'giữa' signal and sufficient length should decompose."""
        enhancer = QueryEnhancer()
        query = "sự khác biệt giữa quy trình nhập khẩu hàng thông thường và hàng đông lạnh tại cảng Cát Lái là gì"
        result = enhancer._classify_strategy(query)
        assert result == QueryStrategy.DECOMPOSED


class TestEnhancedQueryDataclass:
    """Tests for EnhancedQuery dataclass structure."""

    def test_direct_enhanced_query_structure(self):
        """Direct enhancement should return original query in queries list."""
        eq = EnhancedQuery(
            original="biểu giá container",
            queries=["biểu giá container"],
            strategy=QueryStrategy.DIRECT,
            hyde_output=None,
        )
        assert eq.original == "biểu giá container"
        assert len(eq.queries) == 1
        assert eq.queries[0] == eq.original
        assert eq.strategy == QueryStrategy.DIRECT
        assert eq.hyde_output is None

    def test_hyde_enhanced_query_structure(self):
        """HyDE enhancement should have hyde_output populated."""
        eq = EnhancedQuery(
            original="quy trình xuất khẩu container",
            queries=["Quy trình xuất khẩu container tại cảng Tân Cảng..."],
            strategy=QueryStrategy.HYDE,
            hyde_output="Quy trình xuất khẩu container tại cảng Tân Cảng...",
        )
        assert eq.strategy == QueryStrategy.HYDE
        assert eq.hyde_output is not None
        assert len(eq.queries) == 1

    def test_decomposed_enhanced_query_structure(self):
        """Decomposed enhancement should have multiple queries."""
        eq = EnhancedQuery(
            original="so sánh giá container 20ft và 40ft",
            queries=["giá container 20ft", "giá container 40ft"],
            strategy=QueryStrategy.DECOMPOSED,
            hyde_output=None,
        )
        assert eq.strategy == QueryStrategy.DECOMPOSED
        assert len(eq.queries) == 2
        assert eq.hyde_output is None


class TestQueryStrategyEnum:
    """Tests for QueryStrategy enum values."""

    def test_strategy_values(self):
        """Enum should have exactly 3 strategies."""
        assert QueryStrategy.DIRECT.value == "direct"
        assert QueryStrategy.HYDE.value == "hyde"
        assert QueryStrategy.DECOMPOSED.value == "decomposed"


class TestHyDEStrategy:
    """Tests for HyDE (Hypothetical Document Embedding) strategy."""

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_hyde_returns_hypothetical_answer(self, mock_llm):
        """HyDE should call LLM and return hypothetical answer as query."""
        mock_llm.return_value = (
            "Quy trình xuất khẩu hàng đông lạnh qua cảng Cát Lái bao gồm các bước: "
            "đăng ký tờ khai hải quan, kiểm tra chất lượng hàng hóa, cấp giấy chứng nhận "
            "kiểm dịch, vận chuyển container lạnh vào bãi, và hoàn tất thủ tục thông quan."
        )

        enhancer = QueryEnhancer()
        result = enhancer.enhance(
            "Tôi muốn biết quy trình xuất khẩu hàng đông lạnh qua cảng Cát Lái "
            "gồm những bước nào, cần giấy tờ gì, thời gian xử lý bao lâu"
        )

        assert result.strategy == QueryStrategy.HYDE
        assert result.hyde_output is not None
        assert len(result.queries) == 1
        assert result.queries[0] == result.hyde_output
        assert "cảng Cát Lái" in result.hyde_output or "container" in result.hyde_output
        mock_llm.assert_called_once()

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_hyde_uses_correct_prompt(self, mock_llm):
        """HyDE should send Vietnamese port domain prompt to LLM."""
        mock_llm.return_value = "Hypothetical answer text."

        enhancer = QueryEnhancer()
        query = "thủ tục hải quan nhập khẩu hàng hóa đông lạnh tại cảng Tân Cảng chi tiết từng bước"
        enhancer.enhance(query)

        # Check that LLM was called with HyDE prompts
        call_args = mock_llm.call_args
        system_prompt = call_args.kwargs.get("system_prompt") or call_args[0][0]
        user_prompt = call_args.kwargs.get("user_prompt") or call_args[0][1]
        assert "Tân Cảng Sài Gòn" in system_prompt
        assert query in user_prompt

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_hyde_fallback_to_direct_on_llm_failure(self, mock_llm):
        """If HyDE LLM call fails, should fall back to DIRECT strategy."""
        mock_llm.side_effect = Exception("OpenRouter rate limit exceeded")

        enhancer = QueryEnhancer()
        result = enhancer.enhance(
            "quy trình xuất khẩu hàng đông lạnh qua cảng Cát Lái cần những bước nào chi tiết"
        )

        # Should fallback to DIRECT, not crash
        assert result.strategy == QueryStrategy.DIRECT
        assert result.queries[0] == result.original
        assert result.hyde_output is None

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_hyde_output_is_vietnamese(self, mock_llm):
        """HyDE output should be Vietnamese text (as prompted)."""
        mock_llm.return_value = (
            "Theo quy định của Tân Cảng Sài Gòn, biểu giá dịch vụ nâng hạ container "
            "được áp dụng theo từng loại container và loại hàng hóa. Các mức phí bao gồm "
            "phí nâng container, phí hạ container, phí lưu bãi và các phụ phí liên quan."
        )

        enhancer = QueryEnhancer()
        result = enhancer.enhance(
            "biểu giá dịch vụ nâng hạ container tại cảng Tân Cảng Sài Gòn áp dụng như thế nào"
        )

        assert result.strategy == QueryStrategy.HYDE
        # Vietnamese text should contain common Vietnamese characters
        assert any(c in result.hyde_output for c in "àáâãèéêìíòóôõùú")


class TestDecompositionStrategy:
    """Tests for Query Decomposition strategy."""

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_decomposition_returns_sub_queries(self, mock_llm):
        """Decomposition should split complex query into sub-queries."""
        mock_llm.return_value = json.dumps({
            "sub_queries": [
                "biểu giá container 20ft tại cảng Cát Lái",
                "biểu giá container 40ft tại cảng Cát Lái",
                "biểu giá container 20ft tại cảng Hiệp Phước",
                "biểu giá container 40ft tại cảng Hiệp Phước",
            ]
        })

        enhancer = QueryEnhancer()
        result = enhancer.enhance(
            "so sánh biểu giá container 20ft và 40ft tại cảng Cát Lái và Hiệp Phước chi tiết nhất"
        )

        assert result.strategy == QueryStrategy.DECOMPOSED
        assert len(result.queries) == 4
        assert result.hyde_output is None
        assert "20ft" in result.queries[0]

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_decomposition_caps_at_max_sub_queries(self, mock_llm):
        """Should cap sub-queries at DECOMPOSE_MAX_SUB_QUERIES."""
        mock_llm.return_value = json.dumps({
            "sub_queries": [f"sub-query {i}" for i in range(10)]
        })

        enhancer = QueryEnhancer()
        result = enhancer.enhance(
            "so sánh tất cả các loại phí container qua từng cảng biển tại Việt Nam chi tiết"
        )

        assert result.strategy == QueryStrategy.DECOMPOSED
        assert len(result.queries) <= 4

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_decomposition_fallback_to_hyde_on_invalid_json(self, mock_llm):
        """If LLM returns invalid JSON, fall back to HYDE."""
        # First call (decomposition) returns garbage
        # Second call (hyde fallback) returns valid answer
        mock_llm.side_effect = [
            "This is not JSON at all, just plain text",
            "Hypothetical answer for HYDE fallback.",
        ]

        enhancer = QueryEnhancer()
        result = enhancer.enhance(
            "so sánh quy trình nhập khẩu và xuất khẩu container tại cảng biển Tân Cảng chi tiết"
        )

        # Should fall back to HYDE since decomposition JSON parsing failed
        assert result.strategy == QueryStrategy.HYDE
        assert result.hyde_output is not None

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_decomposition_fallback_to_direct_on_total_failure(self, mock_llm):
        """If both decomposition and HYDE LLM calls fail, fall back to DIRECT."""
        mock_llm.side_effect = Exception("All LLM calls failed")

        enhancer = QueryEnhancer()
        result = enhancer.enhance(
            "so sánh quy trình nhập khẩu và xuất khẩu container đông lạnh tại cảng Tân Cảng chi tiết"
        )

        # Both decomposition and HYDE failed → DIRECT
        assert result.strategy == QueryStrategy.DIRECT
        assert result.queries[0] == result.original

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_decomposition_handles_markdown_fenced_json(self, mock_llm):
        """Should handle LLM output wrapped in markdown code fences."""
        mock_llm.return_value = '```json\n{"sub_queries": ["câu hỏi 1", "câu hỏi 2"]}\n```'

        enhancer = QueryEnhancer()
        result = enhancer.enhance(
            "so sánh chi phí lưu bãi container tại cảng Cát Lái và cảng Hiệp Phước năm vừa qua"
        )

        assert result.strategy == QueryStrategy.DECOMPOSED
        assert len(result.queries) == 2

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_decomposition_handles_plain_array(self, mock_llm):
        """Should handle LLM returning a plain JSON array without wrapper."""
        mock_llm.return_value = '["câu hỏi con 1", "câu hỏi con 2", "câu hỏi con 3"]'

        enhancer = QueryEnhancer()
        result = enhancer.enhance(
            "so sánh biểu giá dịch vụ nâng hạ container giữa các cảng biển lớn tại miền Nam"
        )

        assert result.strategy == QueryStrategy.DECOMPOSED
        assert len(result.queries) == 3

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_decomposition_empty_sub_queries_falls_to_hyde(self, mock_llm):
        """Empty sub_queries array should fall back to HYDE."""
        # First call returns empty sub_queries, second call is HYDE
        mock_llm.side_effect = [
            '{"sub_queries": []}',
            "Đây là câu trả lời giả định cho HYDE fallback.",
        ]

        enhancer = QueryEnhancer()
        result = enhancer.enhance(
            "so sánh quy trình vận chuyển hàng hóa đông lạnh và hàng khô tại cảng Tân Cảng"
        )

        assert result.strategy == QueryStrategy.HYDE


class TestParseDecompositionOutput:
    """Tests for the static _parse_decomposition_output method."""

    def test_parse_valid_json_dict(self):
        """Should parse standard dict format."""
        result = QueryEnhancer._parse_decomposition_output(
            '{"sub_queries": ["q1", "q2"]}'
        )
        assert result == ["q1", "q2"]

    def test_parse_valid_json_array(self):
        """Should parse plain array format."""
        result = QueryEnhancer._parse_decomposition_output(
            '["q1", "q2", "q3"]'
        )
        assert result == ["q1", "q2", "q3"]

    def test_parse_markdown_fenced(self):
        """Should strip markdown code fences."""
        result = QueryEnhancer._parse_decomposition_output(
            '```json\n{"sub_queries": ["q1"]}\n```'
        )
        assert result == ["q1"]

    def test_parse_invalid_json(self):
        """Invalid JSON should return empty list."""
        result = QueryEnhancer._parse_decomposition_output(
            "this is not json"
        )
        assert result == []

    def test_parse_empty_string(self):
        """Empty string should return empty list."""
        result = QueryEnhancer._parse_decomposition_output("")
        assert result == []

    def test_parse_filters_empty_strings(self):
        """Should filter out empty/whitespace-only sub-queries."""
        result = QueryEnhancer._parse_decomposition_output(
            '{"sub_queries": ["q1", "", "  ", "q2"]}'
        )
        assert result == ["q1", "q2"]
