"""
Token estimation utilities — ported from Smart2Brain tokenEstimator.ts.

Vietnamese adaptation: uses TOKENS_PER_WORD_VI = 1.8 (vs 1.3 English)
due to diacritics and subword tokenization overhead.

Constants kept identical to Smart2Brain production values unless noted.
"""

from __future__ import annotations

import re

# ── Constants (from Smart2Brain tokenEstimator.ts) ─────────────────────────
TOKENS_PER_WORD_VI = 1.8  # S2B uses 1.3 for English; Vietnamese needs more
PER_MESSAGE_OVERHEAD = 80  # from S2B
SYSTEM_PROMPT_OVERHEAD = 120  # from S2B
TOOL_CALL_OVERHEAD = 60  # from S2B

MODEL_CONTEXT_WINDOWS: dict[str, int] = {
    "claude-opus-4-6": 200_000,
    "gpt-5.3-codex": 128_000,
    # Legacy entries (backward compat)
    "openai/gpt-4o-mini": 128_000,
    "openai/gpt-5-nano": 128_000,
}

DEFAULT_CONTEXT_WINDOW = 128_000

# ── Word splitting regex for Vietnamese ────────────────────────────────────
_WORD_RE = re.compile(r"\S+")


def estimate_tokens(text: str) -> int:
    """Estimate token count for a text string.

    Port of ``estimateTokens()`` from tokenEstimator.ts.
    Uses word-split + multiply by TOKENS_PER_WORD_VI.
    """
    if not text:
        return 0
    word_count = len(_WORD_RE.findall(text))
    return int(word_count * TOKENS_PER_WORD_VI)


def estimate_message_tokens(messages: list[dict]) -> dict:
    """Estimate tokens for a list of chat messages.

    Port of ``estimateBaseMessagePayloadTokens()`` from tokenEstimator.ts.

    Parameters
    ----------
    messages : list[dict]
        Each dict must have ``role`` and ``content`` keys.

    Returns
    -------
    dict
        ``total``: total estimated tokens
        ``per_message``: list of per-message token counts
        ``overhead``: total overhead tokens
    """
    per_message: list[int] = []
    total = 0

    for msg in messages:
        content = msg.get("content", "") or ""
        role = msg.get("role", "")

        content_tokens = estimate_tokens(content)
        role_tokens = estimate_tokens(role)
        msg_tokens = content_tokens + role_tokens + PER_MESSAGE_OVERHEAD

        per_message.append(msg_tokens)
        total += msg_tokens

    return {
        "total": total,
        "per_message": per_message,
        "overhead": len(messages) * PER_MESSAGE_OVERHEAD,
    }


def estimate_conversation_tokens(messages: list[dict]) -> int:
    """Return total estimated token count for an entire conversation.

    Convenience wrapper around :func:`estimate_message_tokens`.
    """
    return estimate_message_tokens(messages)["total"]


def get_context_window(model: str) -> int:
    """Look up the context window size for a model, with fallback."""
    return MODEL_CONTEXT_WINDOWS.get(model, DEFAULT_CONTEXT_WINDOW)
