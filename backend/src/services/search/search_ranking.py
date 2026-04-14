"""
Search ranking — title/tag/alias boost functions.

Ported from Smart2Brain's ``searchRanking.ts``.
Applies post-fusion boosts based on query-title/tag overlap.

Constants (from S2B):
  - TITLE_BOOST_MAX = 0.03
  - ALIAS_BOOST_MAX = 0.028
  - TAG_BOOST_MAX = 0.02
"""

from __future__ import annotations

import re
import unicodedata

# ── Constants from Smart2Brain searchRanking.ts ──────────────────────────
TITLE_BOOST_MAX = 0.03   # Max title boost (line 93 in S2B)
ALIAS_BOOST_MAX = 0.028  # Max alias boost (line 94 in S2B)
TAG_BOOST_MAX = 0.02     # Tag boost


# ── Text normalization ───────────────────────────────────────────────────

def normalize_text(text: str) -> str:
    """Lowercase, strip diacritics for matching, remove punctuation."""
    if not text:
        return ""
    # NFC normalize → lowercase
    text = unicodedata.normalize("NFC", text).lower().strip()
    # Remove punctuation but keep Vietnamese diacritics
    text = re.sub(r"[^\w\s]", " ", text)
    # Collapse whitespace
    text = re.sub(r"\s+", " ", text).strip()
    return text


def tokenize(text: str) -> list[str]:
    """Split into significant terms (> 1 char), lowercased."""
    normalized = normalize_text(text)
    if not normalized:
        return []
    return [t for t in normalized.split() if len(t) > 1]


# ── Title boost ──────────────────────────────────────────────────────────

def calculate_title_boost(
    query: str,
    title: str,
    max_boost: float = TITLE_BOOST_MAX,
) -> float:
    """Calculate title relevance boost.

    Tiered matching (port from S2B ``searchRanking.ts``):
      - exact match       → max_boost (1.0x)
      - title starts with → 0.8x
      - title contains    → 0.8x
      - all query terms   → 0.6x
      - partial terms     → ratio * 0.6x
    """
    if not query or not title:
        return 0.0

    q_norm = normalize_text(query)
    t_norm = normalize_text(title)

    if not q_norm or not t_norm:
        return 0.0

    # Exact match
    if q_norm == t_norm:
        return max_boost

    # Title starts with query
    if t_norm.startswith(q_norm):
        return max_boost * 0.8

    # Title contains query
    if q_norm in t_norm:
        return max_boost * 0.8

    # Term-level matching
    q_terms = set(tokenize(query))
    t_terms = set(tokenize(title))

    if not q_terms:
        return 0.0

    matched = q_terms & t_terms

    # All query terms present in title
    if matched == q_terms:
        return max_boost * 0.6

    # Partial term match — proportional boost
    if matched:
        ratio = len(matched) / len(q_terms)
        return max_boost * ratio * 0.6

    return 0.0


# ── Tag boost ────────────────────────────────────────────────────────────

def calculate_tag_boost(
    query: str,
    tags: list[str] | str,
    max_boost: float = TAG_BOOST_MAX,
) -> float:
    """Calculate tag relevance boost.

    Matching tiers (from S2B):
      - exact tag match → max_boost (1.0x)
      - tag starts with → 0.4x
      - tag contains    → 0.25x
    """
    if not query or not tags:
        return 0.0

    # Normalize tags: accept comma-separated string or list
    if isinstance(tags, str):
        tag_list = [t.strip() for t in tags.split(",") if t.strip()]
    else:
        tag_list = [t for t in tags if t]

    if not tag_list:
        return 0.0

    q_norm = normalize_text(query)
    if not q_norm:
        return 0.0

    best_boost = 0.0
    for tag in tag_list:
        t_norm = normalize_text(tag)
        if not t_norm:
            continue

        if q_norm == t_norm:
            return max_boost  # Exact → return immediately (max)

        if t_norm.startswith(q_norm):
            best_boost = max(best_boost, max_boost * 0.4)
        elif q_norm in t_norm or t_norm in q_norm:
            best_boost = max(best_boost, max_boost * 0.25)

    return best_boost


# ── Combined boost ───────────────────────────────────────────────────────

def calculate_combined_boost(
    query: str,
    title: str = "",
    tags: list[str] | str = "",
) -> float:
    """Calculate total relevance boost from title + tags."""
    return (
        calculate_title_boost(query, title)
        + calculate_tag_boost(query, tags)
    )
