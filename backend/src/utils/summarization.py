"""
Smart summarization utilities — ported from Smart2Brain summarization.ts.

Replaces hardcoded "every 10 messages" trigger with token-aware summarization
that considers the model's context window capacity.

All constants are direct ports from Smart2Brain production values.
"""

from __future__ import annotations

from src.utils.token_estimator import get_context_window

# ── Constants (direct ports from summarization.ts lines 1-5) ──────────────
SUMMARY_TRIGGER_RATIO = 0.8         # line 1: trigger at 80% context usage
SUMMARY_KEEP_MESSAGE_COUNT = 12     # line 2: keep 12 most recent messages unsummarized
SUMMARY_MIN_TRIGGER_TOKENS = 12_000  # line 3: minimum tokens before triggering
SUMMARY_MIN_TRIM_TOKENS = 6_000     # line 4: minimum tokens to summarize
SUMMARY_MAX_TRIM_TOKENS = 24_000    # line 5: maximum tokens to summarize

# ── Improved summarization prompt (ported from S2B SUMMARY_PROMPT lines 7-17) ──
SUMMARY_PROMPT_VI = (
    "Tóm tắt cuộc hội thoại trước đó để trợ lý có thể tiếp tục chính xác.\n\n"
    "BẢO TOÀN:\n"
    "- Mục tiêu, sở thích, ràng buộc của người dùng\n"
    "- Các sự kiện, quyết định quan trọng, câu hỏi chưa giải quyết\n"
    "- Kết quả tra cứu, tài liệu tham khảo còn liên quan\n"
    "- Các chỉ dẫn cụ thể cần tiếp tục áp dụng\n\n"
    "Viết súc tích nhưng cụ thể. KHÔNG bịa thông tin."
)


def get_summarization_trigger_tokens(context_window: int) -> int | None:
    """Calculate the token threshold at which summarization should trigger.

    Port of ``getSummarizationTriggerTokens()`` from summarization.ts.

    Parameters
    ----------
    context_window : int
        Model's context window size in tokens.

    Returns
    -------
    int | None
        Trigger threshold in tokens, or None if context is too small.
    """
    trigger = int(context_window * SUMMARY_TRIGGER_RATIO)
    if trigger < SUMMARY_MIN_TRIGGER_TOKENS:
        return None  # Context window too small for smart summarization
    return trigger


def get_trim_tokens(trigger_tokens: int | None) -> int:
    """Calculate how many tokens of conversation history to include in the summary.

    Port of ``getTrimTokensToSummarize()`` from summarization.ts.

    Parameters
    ----------
    trigger_tokens : int | None
        The trigger threshold from :func:`get_summarization_trigger_tokens`.

    Returns
    -------
    int
        Number of tokens to trim/summarize.
    """
    if trigger_tokens is None:
        return SUMMARY_MIN_TRIM_TOKENS

    trim = int(trigger_tokens * 0.5)
    return max(SUMMARY_MIN_TRIM_TOKENS, min(trim, SUMMARY_MAX_TRIM_TOKENS))


def should_summarize(estimated_tokens: int, context_window: int) -> bool:
    """Determine whether the conversation should be summarized.

    Port of ``shouldSummarizeForEstimatedTokens()`` from summarization.ts.

    Parameters
    ----------
    estimated_tokens : int
        Current estimated token count of the entire conversation.
    context_window : int
        Model's context window size.

    Returns
    -------
    bool
        True if summarization should be triggered.
    """
    trigger = get_summarization_trigger_tokens(context_window)
    if trigger is None:
        return False
    return estimated_tokens >= trigger


def get_summarization_params(model: str, estimated_tokens: int) -> dict | None:
    """Convenience: check if summarization needed and return params.

    Parameters
    ----------
    model : str
        Model identifier for context window lookup.
    estimated_tokens : int
        Current estimated conversation token count.

    Returns
    -------
    dict | None
        Dict with ``keep_count`` and ``trim_tokens`` if summarization should
        happen, None otherwise.
    """
    context_window = get_context_window(model)
    if not should_summarize(estimated_tokens, context_window):
        return None

    trigger_tokens = get_summarization_trigger_tokens(context_window)
    return {
        "keep_count": SUMMARY_KEEP_MESSAGE_COUNT,
        "trim_tokens": get_trim_tokens(trigger_tokens),
    }
