"""Tests for token_estimator and context_builder (Phase 1: Token-Aware Context Building)."""

import pytest


# ── Token Estimator Tests ─────────────────────────────────────────────────


class TestEstimateTokens:
    def test_empty_string(self):
        from src.utils.token_estimator import estimate_tokens
        assert estimate_tokens("") == 0

    def test_single_word(self):
        from src.utils.token_estimator import estimate_tokens
        result = estimate_tokens("xin")
        assert result == 1  # 1 word * 1.8, int = 1

    def test_vietnamese_sentence(self):
        from src.utils.token_estimator import estimate_tokens
        # "Xin chào, tôi muốn hỏi về cảng" = 7 words
        result = estimate_tokens("Xin chào, tôi muốn hỏi về cảng")
        assert result == int(7 * 1.8)  # 12

    def test_long_text(self):
        from src.utils.token_estimator import estimate_tokens
        text = " ".join(["từ"] * 100)
        assert estimate_tokens(text) == int(100 * 1.8)

    def test_none_like_empty(self):
        from src.utils.token_estimator import estimate_tokens
        assert estimate_tokens("") == 0


class TestEstimateMessageTokens:
    def test_empty_messages(self):
        from src.utils.token_estimator import estimate_message_tokens
        result = estimate_message_tokens([])
        assert result["total"] == 0
        assert result["per_message"] == []

    def test_single_message(self):
        from src.utils.token_estimator import estimate_message_tokens, PER_MESSAGE_OVERHEAD
        msgs = [{"role": "user", "content": "Xin chào"}]
        result = estimate_message_tokens(msgs)
        assert result["total"] > PER_MESSAGE_OVERHEAD  # content + overhead
        assert len(result["per_message"]) == 1

    def test_multiple_messages(self):
        from src.utils.token_estimator import estimate_message_tokens
        msgs = [
            {"role": "user", "content": "Hỏi"},
            {"role": "assistant", "content": "Trả lời dài hơn một chút"},
        ]
        result = estimate_message_tokens(msgs)
        assert result["total"] > 0
        assert len(result["per_message"]) == 2
        # Second message should have more tokens
        assert result["per_message"][1] >= result["per_message"][0]


class TestEstimateConversationTokens:
    def test_wrapper(self):
        from src.utils.token_estimator import (
            estimate_conversation_tokens,
            estimate_message_tokens,
        )
        msgs = [{"role": "user", "content": "test"}]
        assert estimate_conversation_tokens(msgs) == estimate_message_tokens(msgs)["total"]


class TestGetContextWindow:
    def test_known_model(self):
        from src.utils.token_estimator import get_context_window
        assert get_context_window("openai/gpt-4o-mini") == 128_000

    def test_unknown_model_fallback(self):
        from src.utils.token_estimator import get_context_window, DEFAULT_CONTEXT_WINDOW
        assert get_context_window("unknown/model") == DEFAULT_CONTEXT_WINDOW


# ── Context Builder Tests ─────────────────────────────────────────────────


class TestContextBuilder:
    def _make_builder(self, context_window=10_000):
        from src.services.context_builder import ContextBuilder
        return ContextBuilder(model="openai/gpt-4o-mini", context_window=context_window)

    def test_basic_build(self):
        builder = self._make_builder()
        ctx = builder.build_context(
            system_prompt="You are a helpful assistant.",
            memories=["User likes ports"],
            summary="Previous discussion about shipping",
            messages=[
                {"role": "user", "content": "Xin chào"},
                {"role": "assistant", "content": "Chào bạn"},
            ],
            rag_context="Document about port fees.",
        )
        assert ctx.system_prompt == "You are a helpful assistant."
        assert "User likes ports" in ctx.long_term_block
        assert ctx.budget_report.messages_included > 0
        assert ctx.budget_report.context_window == 10_000

    def test_empty_inputs(self):
        builder = self._make_builder()
        ctx = builder.build_context(system_prompt="System")
        assert ctx.system_prompt == "System"
        assert ctx.long_term_block == ""
        assert ctx.summary_block == ""
        assert ctx.recent_block == ""
        assert ctx.rag_context == ""
        assert ctx.budget_report.messages_included == 0

    def test_messages_newest_first_fitting(self):
        """With a small budget, only newest messages should be included."""
        builder = self._make_builder(context_window=500)
        messages = [
            {"role": "user", "content": f"Message {i} " + "x" * 50}
            for i in range(20)
        ]
        ctx = builder.build_context(
            system_prompt="Short prompt",
            messages=messages,
        )
        # Not all 20 messages should fit in 500 token window
        assert ctx.budget_report.messages_included < 20
        assert ctx.budget_report.messages_included > 0
        # The included messages should be the NEWEST ones
        if ctx.messages:
            last_msg = ctx.messages[-1]
            assert last_msg["content"].startswith("Message 19")

    def test_budget_report_filled(self):
        builder = self._make_builder()
        ctx = builder.build_context(
            system_prompt="System prompt here",
            memories=["mem1"],
            summary="A summary",
            messages=[{"role": "user", "content": "Hello"}],
            rag_context="Some document text",
        )
        report = ctx.budget_report
        assert report.context_window == 10_000
        assert report.total_budget > 0
        assert report.system_prompt_tokens > 0
        assert report.memories_tokens > 0
        assert report.remaining_tokens >= 0

    def test_truncation_when_budget_tight(self):
        """RAG context should be truncated when budget is tight."""
        builder = self._make_builder(context_window=300)
        long_rag = "Đây là tài liệu rất dài. " * 100
        ctx = builder.build_context(
            system_prompt="Short",
            rag_context=long_rag,
        )
        # RAG context should be truncated, not full
        assert len(ctx.rag_context) < len(long_rag)


class TestFitMessagesToBudget:
    def test_empty(self):
        from src.services.context_builder import ContextBuilder
        fitted, used = ContextBuilder._fit_messages_to_budget([], 1000)
        assert fitted == []
        assert used == 0

    def test_zero_budget(self):
        from src.services.context_builder import ContextBuilder
        msgs = [{"role": "user", "content": "hello"}]
        fitted, used = ContextBuilder._fit_messages_to_budget(msgs, 0)
        assert fitted == []

    def test_chronological_order_preserved(self):
        from src.services.context_builder import ContextBuilder
        msgs = [
            {"role": "user", "content": "first"},
            {"role": "assistant", "content": "second"},
            {"role": "user", "content": "third"},
        ]
        fitted, _ = ContextBuilder._fit_messages_to_budget(msgs, 10_000)
        assert len(fitted) == 3
        assert fitted[0]["content"] == "first"
        assert fitted[2]["content"] == "third"


class TestTruncateToBudget:
    def test_empty(self):
        from src.services.context_builder import ContextBuilder
        assert ContextBuilder._truncate_to_budget("", 100) == ""

    def test_fits_completely(self):
        from src.services.context_builder import ContextBuilder
        text = "Short text"
        result = ContextBuilder._truncate_to_budget(text, 10_000)
        # Should contain original text (may have truncation marker if estimation is off)
        assert "Short" in result

    def test_zero_budget(self):
        from src.services.context_builder import ContextBuilder
        assert ContextBuilder._truncate_to_budget("anything", 0) == ""
