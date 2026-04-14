"""Parent-to-child chunk splitting for 2-tier retrieval.

Splits large parent chunks into smaller child chunks optimized for
vector search. Children inherit parent metadata and include a parent_id
for fetching full context at retrieval time.

Constants calibrated for Vietnamese text via token_estimator.
"""
from __future__ import annotations

import re
from typing import Any

from src.utils.token_estimator import estimate_tokens

# ── Constants ────────────────────────────────────────────────────────────
PARENT_CHUNK_MAX_TOKENS = 2048
CHILD_CHUNK_MAX_TOKENS = 384
CHILD_CHUNK_OVERLAP_TOKENS = 50

# Threshold: if parent is smaller than this, don't split
_NO_SPLIT_THRESHOLD = int(CHILD_CHUNK_MAX_TOKENS * 1.5)

# Sentence-end regex for Vietnamese (period, question mark, exclamation)
_SENTENCE_END_RE = re.compile(r"(?<=[.!?])\s+")


def split_into_children(
    parent_text: str,
    parent_id: str,
    parent_meta: dict[str, Any],
) -> list[dict[str, Any]]:
    """Split a parent chunk into smaller child chunks for vector search.

    Each child inherits the parent's metadata and adds parent_id for retrieval.
    Uses sentence-boundary splitting with overlap for context continuity.

    Args:
        parent_text: Full parent chunk text.
        parent_id: UUID string of the ChunkParent row.
        parent_meta: Dict with keys: page_number, headings, row_keys.

    Returns:
        List of child chunk dicts with keys:
        text, parent_id, page, headings, row_keys, chunk_index.
    """
    if not parent_text or not parent_text.strip():
        return []

    parent_text = parent_text.strip()
    page = parent_meta.get("page_number", 0)
    headings = parent_meta.get("headings", [])
    row_keys = parent_meta.get("row_keys", [])

    parent_tokens = estimate_tokens(parent_text)

    # Small parent: return as single child
    if parent_tokens <= _NO_SPLIT_THRESHOLD:
        return [
            {
                "text": parent_text,
                "parent_id": parent_id,
                "page": page,
                "headings": headings,
                "row_keys": row_keys,
                "chunk_index": 0,
            }
        ]

    # Split into sentences
    sentences = _SENTENCE_END_RE.split(parent_text)
    sentences = [s.strip() for s in sentences if s.strip()]

    if not sentences:
        return [
            {
                "text": parent_text,
                "parent_id": parent_id,
                "page": page,
                "headings": headings,
                "row_keys": row_keys,
                "chunk_index": 0,
            }
        ]

    # Build children by accumulating sentences up to CHILD_CHUNK_MAX_TOKENS
    children: list[dict[str, Any]] = []
    current_sentences: list[str] = []
    current_tokens = 0

    for sentence in sentences:
        sentence_tokens = estimate_tokens(sentence)

        if current_tokens + sentence_tokens > CHILD_CHUNK_MAX_TOKENS and current_sentences:
            # Flush current child
            child_text = " ".join(current_sentences)
            children.append(
                {
                    "text": child_text,
                    "parent_id": parent_id,
                    "page": page,
                    "headings": headings,
                    "row_keys": row_keys,
                    "chunk_index": len(children),
                }
            )

            # Compute overlap: take last N sentences that fit in CHILD_CHUNK_OVERLAP_TOKENS
            overlap_sentences: list[str] = []
            overlap_tokens = 0
            for s in reversed(current_sentences):
                s_tokens = estimate_tokens(s)
                if overlap_tokens + s_tokens > CHILD_CHUNK_OVERLAP_TOKENS:
                    break
                overlap_sentences.insert(0, s)
                overlap_tokens += s_tokens

            # Start next child with overlap
            current_sentences = list(overlap_sentences)
            current_tokens = overlap_tokens

        current_sentences.append(sentence)
        current_tokens += sentence_tokens

    # Flush remaining
    if current_sentences:
        child_text = " ".join(current_sentences)
        children.append(
            {
                "text": child_text,
                "parent_id": parent_id,
                "page": page,
                "headings": headings,
                "row_keys": row_keys,
                "chunk_index": len(children),
            }
        )

    return children
