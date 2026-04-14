"""Tests for summarization utilities (Phase 2: Smart Summarization)."""

import pytest


class TestGetSummarizationTriggerTokens:
    def test_normal_context_window(self):
        from src.utils.summarization import get_summarization_trigger_tokens
        # 128k * 0.8 = 102_400 — well above SUMMARY_MIN_TRIGGER_TOKENS (12_000)
        result = get_summarization_trigger_tokens(128_000)
        assert result == 102_400

    def test_small_context_window(self):
        from src.utils.summarization import get_summarization_trigger_tokens
        # 10k * 0.8 = 8_000 — below SUMMARY_MIN_TRIGGER_TOKENS (12_000)
        result = get_summarization_trigger_tokens(10_000)
        assert result is None

    def test_exact_threshold(self):
        from src.utils.summarization import get_summarization_trigger_tokens
        # 15_000 * 0.8 = 12_000 — exactly at SUMMARY_MIN_TRIGGER_TOKENS
        result = get_summarization_trigger_tokens(15_000)
        assert result == 12_000


class TestGetTrimTokens:
    def test_normal(self):
        from src.utils.summarization import get_trim_tokens
        # 102_400 * 0.5 = 51_200 → clamped to SUMMARY_MAX_TRIM_TOKENS (24_000)
        result = get_trim_tokens(102_400)
        assert result == 24_000

    def test_small_trigger(self):
        from src.utils.summarization import get_trim_tokens
        # 12_000 * 0.5 = 6_000 → SUMMARY_MIN_TRIM_TOKENS
        result = get_trim_tokens(12_000)
        assert result == 6_000

    def test_none_trigger(self):
        from src.utils.summarization import get_trim_tokens
        result = get_trim_tokens(None)
        assert result == 6_000

    def test_mid_range(self):
        from src.utils.summarization import get_trim_tokens
        # 30_000 * 0.5 = 15_000 → between min and max
        result = get_trim_tokens(30_000)
        assert result == 15_000


class TestShouldSummarize:
    def test_above_threshold(self):
        from src.utils.summarization import should_summarize
        assert should_summarize(110_000, 128_000) is True

    def test_below_threshold(self):
        from src.utils.summarization import should_summarize
        assert should_summarize(50_000, 128_000) is False

    def test_exactly_at_threshold(self):
        from src.utils.summarization import should_summarize
        assert should_summarize(102_400, 128_000) is True

    def test_small_context_never_triggers(self):
        from src.utils.summarization import should_summarize
        # Context window too small → trigger is None → always False
        assert should_summarize(9_000, 10_000) is False

    def test_empty_conversation(self):
        from src.utils.summarization import should_summarize
        assert should_summarize(0, 128_000) is False


class TestGetSummarizationParams:
    def test_returns_params_when_needed(self):
        from src.utils.summarization import get_summarization_params
        # 110k tokens with 128k context → should trigger
        result = get_summarization_params("openai/gpt-4o-mini", 110_000)
        assert result is not None
        assert result["keep_count"] == 12
        assert result["trim_tokens"] > 0

    def test_returns_none_when_not_needed(self):
        from src.utils.summarization import get_summarization_params
        # 1k tokens with 128k context → shouldn't trigger
        result = get_summarization_params("openai/gpt-4o-mini", 1_000)
        assert result is None

    def test_unknown_model_uses_default(self):
        from src.utils.summarization import get_summarization_params
        # Unknown model gets default 128k window → 110k should trigger
        result = get_summarization_params("unknown/model", 110_000)
        assert result is not None


class TestSummaryPrompt:
    def test_prompt_is_vietnamese(self):
        from src.utils.summarization import SUMMARY_PROMPT_VI
        assert "Tóm tắt" in SUMMARY_PROMPT_VI
        assert "BẢO TOÀN" in SUMMARY_PROMPT_VI
        assert "KHÔNG bịa" in SUMMARY_PROMPT_VI

    def test_prompt_not_empty(self):
        from src.utils.summarization import SUMMARY_PROMPT_VI
        assert len(SUMMARY_PROMPT_VI) > 100


class TestConstants:
    def test_constants_match_s2b(self):
        """Verify constants are direct ports from Smart2Brain summarization.ts."""
        from src.utils.summarization import (
            SUMMARY_TRIGGER_RATIO,
            SUMMARY_KEEP_MESSAGE_COUNT,
            SUMMARY_MIN_TRIGGER_TOKENS,
            SUMMARY_MIN_TRIM_TOKENS,
            SUMMARY_MAX_TRIM_TOKENS,
        )
        assert SUMMARY_TRIGGER_RATIO == 0.8
        assert SUMMARY_KEEP_MESSAGE_COUNT == 12
        assert SUMMARY_MIN_TRIGGER_TOKENS == 12_000
        assert SUMMARY_MIN_TRIM_TOKENS == 6_000
        assert SUMMARY_MAX_TRIM_TOKENS == 24_000
