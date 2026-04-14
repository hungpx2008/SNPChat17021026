"""Tests for IntentRouter — Vietnamese-first heuristic intent classifier.

Run with:
    python -m pytest tests/test_intent_router.py --noconftest -v
"""

from __future__ import annotations

import time

import pytest

from src.services.intent_router import IntentResult, IntentRouter, IntentType


@pytest.fixture
def router() -> IntentRouter:
    return IntentRouter()


# ═══════════════════════════════════════════════════════════════════════
# SQL detection
# ═══════════════════════════════════════════════════════════════════════


class TestSQLDetection:
    """Queries about statistics, numbers, and Tân Cảng operational data."""

    def test_statistics_query(self, router: IntentRouter):
        result = router.classify("Thống kê container tháng 1 năm 2024")
        assert result.intent == IntentType.SQL
        assert result.confidence >= 0.8
        assert len(result.signals) >= 2

    def test_count_query(self, router: IntentRouter):
        result = router.classify("Bao nhiêu container đã xử lý tháng 12?")
        assert result.intent == IntentType.SQL
        assert any("bao nhiêu" in s.lower() or "bao nhiêu" in s.lower() for s in result.signals)

    def test_aggregate_keywords(self, router: IntentRouter):
        result = router.classify("Tổng số TEU sản lượng năm 2023")
        assert result.intent == IntentType.SQL
        assert result.confidence >= 0.8

    def test_revenue_query(self, router: IntentRouter):
        result = router.classify("Doanh thu quý 3 năm 2024 là bao nhiêu?")
        assert result.intent == IntentType.SQL

    def test_comparison_query(self, router: IntentRouter):
        result = router.classify("So sánh sản lượng container năm 2023 và 2024")
        assert result.intent == IntentType.SQL

    def test_time_range_pattern(self, router: IntentRouter):
        result = router.classify("Thống kê từ 2020 đến 2024")
        assert result.intent == IntentType.SQL

    def test_top_n_pattern(self, router: IntentRouter):
        result = router.classify("Top 5 cảng có sản lượng cao nhất")
        assert result.intent == IntentType.SQL

    def test_average_query(self, router: IntentRouter):
        result = router.classify("Trung bình container mỗi tháng là bao nhiêu?")
        assert result.intent == IntentType.SQL

    def test_growth_query(self, router: IntentRouter):
        result = router.classify("Tăng trưởng sản lượng TEU qua các năm")
        assert result.intent == IntentType.SQL

    def test_percentage_query(self, router: IntentRouter):
        result = router.classify("Phần trăm tăng trưởng doanh thu quý 2")
        assert result.intent == IntentType.SQL


# ═══════════════════════════════════════════════════════════════════════
# RAG detection
# ═══════════════════════════════════════════════════════════════════════


class TestRAGDetection:
    """Queries about documents, regulations, and procedures."""

    def test_process_query(self, router: IntentRouter):
        result = router.classify("Quy trình xuất khẩu container đông lạnh")
        assert result.intent == IntentType.RAG
        assert result.confidence >= 0.6

    def test_regulation_query(self, router: IntentRouter):
        result = router.classify("Quy định về lưu kho hàng hóa tại cảng")
        assert result.intent == IntentType.RAG

    def test_procedure_query(self, router: IntentRouter):
        result = router.classify("Thủ tục hải quan xuất nhập khẩu")
        assert result.intent == IntentType.RAG

    def test_fee_schedule(self, router: IntentRouter):
        result = router.classify("Biểu phí dịch vụ cảng biển hiện hành")
        assert result.intent == IntentType.RAG

    def test_guidance_query(self, router: IntentRouter):
        result = router.classify("Hướng dẫn cách khai báo hải quan")
        assert result.intent == IntentType.RAG

    def test_legal_reference(self, router: IntentRouter):
        result = router.classify("Nội dung điều 5 nghị định 123 về vận tải")
        assert result.intent == IntentType.RAG
        assert result.confidence >= 0.8

    def test_circular_reference(self, router: IntentRouter):
        result = router.classify("Thông tư 15 hướng dẫn về thuế xuất khẩu")
        assert result.intent == IntentType.RAG

    def test_document_lookup(self, router: IntentRouter):
        result = router.classify("Tra cứu tài liệu về tiêu chuẩn ISO cảng")
        assert result.intent == IntentType.RAG

    def test_requirements_query(self, router: IntentRouter):
        result = router.classify("Cần những gì để làm thủ tục nhập khẩu?")
        assert result.intent == IntentType.RAG

    def test_paperwork_query(self, router: IntentRouter):
        result = router.classify("Hồ sơ giấy tờ cần thiết để thông quan")
        assert result.intent == IntentType.RAG


# ═══════════════════════════════════════════════════════════════════════
# Chat fallback
# ═══════════════════════════════════════════════════════════════════════


class TestChatFallback:
    """General conversation and greetings should fall back to chat."""

    def test_greeting(self, router: IntentRouter):
        result = router.classify("Xin chào")
        assert result.intent == IntentType.CHAT
        assert result.confidence == 1.0
        assert result.signals == []

    def test_thanks(self, router: IntentRouter):
        result = router.classify("Cảm ơn bạn")
        assert result.intent == IntentType.CHAT

    def test_general_question(self, router: IntentRouter):
        result = router.classify("Bạn có thể giúp gì cho tôi?")
        assert result.intent == IntentType.CHAT

    def test_simple_response(self, router: IntentRouter):
        result = router.classify("Vâng, tôi hiểu rồi")
        assert result.intent == IntentType.CHAT

    def test_who_are_you(self, router: IntentRouter):
        result = router.classify("Bạn là ai?")
        assert result.intent == IntentType.CHAT

    def test_english_greeting(self, router: IntentRouter):
        result = router.classify("Hello, how are you?")
        assert result.intent == IntentType.CHAT


# ═══════════════════════════════════════════════════════════════════════
# Empty / short / edge-case queries
# ═══════════════════════════════════════════════════════════════════════


class TestEdgeCases:
    def test_empty_string(self, router: IntentRouter):
        result = router.classify("")
        assert result.intent == IntentType.CHAT
        assert result.confidence == 1.0

    def test_whitespace_only(self, router: IntentRouter):
        result = router.classify("   \t\n  ")
        assert result.intent == IntentType.CHAT
        assert result.confidence == 1.0

    def test_none_like_empty(self, router: IntentRouter):
        """None is not a valid input, but empty string is."""
        result = router.classify("")
        assert result.intent == IntentType.CHAT

    def test_single_word(self, router: IntentRouter):
        result = router.classify("xin")
        assert result.intent == IntentType.CHAT

    def test_unicode_handling(self, router: IntentRouter):
        # Vietnamese diacritics must be handled properly
        result = router.classify("Thống kê sản lượng")
        assert result.intent == IntentType.SQL

    def test_extra_whitespace(self, router: IntentRouter):
        result = router.classify("  Thống   kê   container   ")
        assert result.intent == IntentType.SQL


# ═══════════════════════════════════════════════════════════════════════
# Case insensitivity
# ═══════════════════════════════════════════════════════════════════════


class TestCaseInsensitivity:
    def test_uppercase_sql(self, router: IntentRouter):
        result = router.classify("THỐNG KÊ CONTAINER")
        assert result.intent == IntentType.SQL

    def test_mixed_case_sql(self, router: IntentRouter):
        result = router.classify("Bao Nhiêu Container TEU")
        assert result.intent == IntentType.SQL

    def test_uppercase_rag(self, router: IntentRouter):
        result = router.classify("QUY TRÌNH XUẤT KHẨU")
        assert result.intent == IntentType.RAG

    def test_mixed_case_rag(self, router: IntentRouter):
        result = router.classify("Hướng Dẫn Thủ Tục Hải Quan")
        assert result.intent == IntentType.RAG


# ═══════════════════════════════════════════════════════════════════════
# Ambiguous queries (both SQL + RAG signals)
# ═══════════════════════════════════════════════════════════════════════


class TestAmbiguous:
    """When a query triggers both SQL and RAG signals, pick the dominant one."""

    def test_sql_dominant(self, router: IntentRouter):
        # More SQL signals: "thống kê", "bao nhiêu", "sản lượng", "năm 2024", "tháng"
        # RAG signal: "quy trình"
        query = "Thống kê bao nhiêu sản lượng theo quy trình năm 2024 tháng 3"
        result = router.classify(query)
        assert result.intent == IntentType.SQL

    def test_rag_dominant(self, router: IntentRouter):
        # RAG signals: "quy trình", "thủ tục", "hướng dẫn", "hồ sơ"
        # SQL signal: "container"
        query = "Quy trình thủ tục hướng dẫn chuẩn bị hồ sơ container"
        result = router.classify(query)
        assert result.intent == IntentType.RAG

    def test_tie_goes_to_sql(self, router: IntentRouter):
        # Equal signals → SQL wins
        # SQL strong: "sản lượng", "doanh thu" (2 signals)
        # RAG: "quy trình", "hướng dẫn" (2 signals)
        query = "Hướng dẫn quy trình sản lượng doanh thu"
        result = router.classify(query)
        assert result.intent == IntentType.SQL, (
            "Ties should be broken in favor of SQL"
        )


# ═══════════════════════════════════════════════════════════════════════
# Confidence levels
# ═══════════════════════════════════════════════════════════════════════


class TestConfidence:
    def test_single_signal_confidence(self, router: IntentRouter):
        # Only one strong SQL keyword: "thống kê"
        result = router.classify("thống kê")
        assert result.intent == IntentType.SQL
        assert 0.55 <= result.confidence <= 0.65

    def test_two_signals_confidence(self, router: IntentRouter):
        # Two SQL keywords: "thống kê" + "container"
        result = router.classify("Thống kê container")
        assert result.intent == IntentType.SQL
        assert 0.70 <= result.confidence <= 0.80

    def test_many_signals_high_confidence(self, router: IntentRouter):
        # Many SQL signals
        result = router.classify(
            "Thống kê tổng số sản lượng doanh thu container TEU năm 2024"
        )
        assert result.intent == IntentType.SQL
        assert result.confidence >= 0.85

    def test_chat_full_confidence(self, router: IntentRouter):
        result = router.classify("Xin chào")
        assert result.confidence == 1.0

    def test_confidence_never_exceeds_one(self, router: IntentRouter):
        # Even with an extreme number of signals
        keywords = " ".join(
            IntentRouter.SQL_STRONG_KEYWORDS + IntentRouter.SQL_WEAK_KEYWORDS
        )
        result = router.classify(keywords)
        assert result.confidence <= 1.0


# ═══════════════════════════════════════════════════════════════════════
# IntentResult dataclass / IntentType enum
# ═══════════════════════════════════════════════════════════════════════


class TestDataStructures:
    def test_intent_type_values(self):
        assert IntentType.CHAT.value == "chat"
        assert IntentType.SQL.value == "sql"
        assert IntentType.RAG.value == "rag"

    def test_intent_type_is_str(self):
        # IntentType(str, Enum) → can be used as string
        assert IntentType.SQL == "sql"
        assert IntentType.RAG.value == "rag"
        assert f"mode={IntentType.RAG.value}" == "mode=rag"

    def test_intent_result_fields(self):
        r = IntentResult(intent=IntentType.CHAT, confidence=1.0, signals=[])
        assert r.intent == IntentType.CHAT
        assert r.confidence == 1.0
        assert r.signals == []

    def test_intent_result_default_signals(self):
        r = IntentResult(intent=IntentType.SQL, confidence=0.8)
        assert r.signals == []


# ═══════════════════════════════════════════════════════════════════════
# Performance
# ═══════════════════════════════════════════════════════════════════════


class TestPerformance:
    def test_latency_under_5ms(self, router: IntentRouter):
        """Classification must complete in <5ms for production use."""
        query = "Thống kê tổng số container TEU sản lượng doanh thu năm 2024 tháng 6"
        iterations = 1000
        start = time.perf_counter()
        for _ in range(iterations):
            router.classify(query)
        elapsed = time.perf_counter() - start
        avg_ms = (elapsed / iterations) * 1000
        assert avg_ms < 5.0, f"Average latency {avg_ms:.2f}ms exceeds 5ms target"


# ═══════════════════════════════════════════════════════════════════════
# Real-world Vietnamese queries (integration-style)
# ═══════════════════════════════════════════════════════════════════════


class TestRealWorldQueries:
    """Realistic queries that users at Tân Cảng Sài Gòn might ask."""

    @pytest.mark.parametrize(
        "query,expected",
        [
            ("Sản lượng container qua cảng Cát Lái tháng 1 năm 2024", IntentType.SQL),
            ("Tổng doanh thu quý 1 năm 2024", IntentType.SQL),
            ("So sánh sản lượng TEU năm 2023 và 2024", IntentType.SQL),
            ("Trung bình lượt xe ra vào bãi mỗi ngày", IntentType.SQL),
            ("Quy trình nhập khẩu hàng đông lạnh", IntentType.RAG),
            ("Biểu phí lưu bãi container tại Tân Cảng", IntentType.RAG),
            ("Thủ tục thông quan hàng xuất khẩu", IntentType.RAG),
            ("Tài liệu hướng dẫn khai báo hải quan điện tử", IntentType.RAG),
            ("Xin chào, tôi cần hỗ trợ", IntentType.CHAT),
            ("Cảm ơn rất nhiều", IntentType.CHAT),
            ("Tạm biệt", IntentType.CHAT),
        ],
    )
    def test_real_world(self, router: IntentRouter, query: str, expected: IntentType):
        result = router.classify(query)
        assert result.intent == expected, (
            f"Query '{query}' classified as {result.intent}, "
            f"expected {expected}. Signals: {result.signals}"
        )
