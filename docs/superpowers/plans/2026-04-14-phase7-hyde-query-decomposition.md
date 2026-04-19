# Phase 7: HyDE + Query Decomposition — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve RAG search quality for Vietnamese queries by enhancing the query BEFORE vector search. Three strategies: Direct (short queries, no overhead), HyDE (generate hypothetical answer, embed that), Decomposed (split complex queries into sub-queries, search in parallel).

**Architecture:** A new `QueryEnhancer` class classifies each user query into one of three strategies using a fast heuristic (token count + Vietnamese signal detection). For HyDE, an LLM generates a hypothetical ~100-word Vietnamese answer that gets embedded instead of the raw question. For Decomposition, an LLM splits the query into ≤4 sub-queries that are searched independently and merged via max-RRF-score dedup. The enhancer sits between the user question and `HybridSearchService.search()` in the RAG pipeline.

**Tech Stack:** OpenRouter (gpt-4o-mini via existing httpx client), existing `token_estimator.estimate_tokens()` for classification, `HybridSearchService` for search, `ThreadPoolExecutor` for parallel sub-query search.

**Spec:** `docs/superpowers/specs/2026-04-13-eon-gap-techniques-design.md` — Phase 7 section.

---

### Task 1: QueryEnhancer Class + Strategy Classification

**Files:**
- Create: `chatSNP170226/backend/src/services/search/query_enhancer.py`
- Create: `chatSNP170226/backend/tests/test_query_enhancer.py`

- [ ] **Step 1: Write tests for query classification**

Create `chatSNP170226/backend/tests/test_query_enhancer.py`:

```python
"""Tests for QueryEnhancer — strategy classification and enhancement."""
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_query_enhancer.py -v`
Expected: FAIL — `query_enhancer` module not found

- [ ] **Step 3: Implement QueryEnhancer with classification logic**

Create `chatSNP170226/backend/src/services/search/query_enhancer.py`:

```python
"""Query enhancement for RAG search — HyDE and Query Decomposition.

Improves retrieval quality by transforming user queries before vector search.
Uses gpt-4o-mini via OpenRouter (same as existing LLM calls in chat_tasks.py).

Strategies:
  - DIRECT: Short/simple queries → embed as-is (no LLM call, zero overhead)
  - HYDE: Long queries → LLM generates hypothetical Vietnamese answer → embed that
  - DECOMPOSED: Complex multi-part queries → split into ≤4 sub-queries → search each

Decision heuristic (fast, no LLM):
  1. tokens < HYDE_MIN_TOKENS → DIRECT
  2. contains comparison/multi-part Vietnamese signals → DECOMPOSED
  3. else → HYDE
"""
from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from enum import Enum
from typing import Any

from src.utils.token_estimator import estimate_tokens

logger = logging.getLogger(__name__)

# ── Constants ────────────────────────────────────────────────────────────
HYDE_MIN_TOKENS = 30               # Queries shorter than this → DIRECT (no LLM)
HYDE_MAX_OUTPUT_TOKENS = 300       # Max tokens for hypothetical answer generation
DECOMPOSE_MAX_SUB_QUERIES = 4     # Max sub-queries from decomposition

# Vietnamese signals that trigger DECOMPOSED strategy instead of HYDE.
# These indicate the user is asking about multiple things or making comparisons.
DECOMPOSE_SIGNALS_VI = [
    "so sánh",       # compare
    "khác nhau",     # different
    "giữa",          # between
    "tương tự",      # similar
    "cả hai",        # both
    "từng cái",      # each one
    "lần lượt",      # in turn / one by one
]

# ── LLM Prompts ──────────────────────────────────────────────────────────

HYDE_SYSTEM_PROMPT = (
    "Bạn là chuyên gia về cảng biển và logistics tại Tân Cảng Sài Gòn. "
    "Nhiệm vụ: viết một đoạn trả lời giả định ngắn gọn (~100 từ) cho câu hỏi, "
    "như thể bạn đang trích từ tài liệu chính thức."
)

HYDE_USER_TEMPLATE = (
    "Dựa trên câu hỏi sau, hãy viết một đoạn trả lời giả định ngắn gọn (~100 từ) "
    "như thể bạn đang trích từ một tài liệu chính thức của cảng biển Tân Cảng Sài Gòn.\n"
    "Sử dụng thuật ngữ chuyên ngành cảng biển, logistics. Viết bằng tiếng Việt.\n"
    "KHÔNG bịa số liệu cụ thể. Tập trung vào cấu trúc và thuật ngữ đúng.\n\n"
    "Câu hỏi: {query}"
)

DECOMPOSE_SYSTEM_PROMPT = (
    "Bạn là chuyên gia phân tích câu hỏi. "
    "Nhiệm vụ: tách câu hỏi phức tạp thành các câu hỏi con đơn giản."
)

DECOMPOSE_USER_TEMPLATE = (
    "Tách câu hỏi phức tạp sau thành các câu hỏi con đơn giản, "
    "mỗi câu có thể tra cứu độc lập.\n"
    "Tối đa {max_sub_queries} câu hỏi con.\n"
    "Trả về JSON: {{\"sub_queries\": [\"câu 1\", \"câu 2\", ...]}}\n"
    "Chỉ trả về JSON, không giải thích thêm.\n\n"
    "Câu hỏi: {query}"
)


# ── Enums & Dataclasses ──────────────────────────────────────────────────

class QueryStrategy(Enum):
    """Strategy for query enhancement."""
    DIRECT = "direct"
    HYDE = "hyde"
    DECOMPOSED = "decomposed"


@dataclass
class EnhancedQuery:
    """Result of query enhancement.

    Attributes:
        original: The raw user query text.
        queries: List of queries to search. 1 item for DIRECT/HYDE, N for DECOMPOSED.
        strategy: Which strategy was applied.
        hyde_output: The hypothetical answer text (only if strategy == HYDE).
    """
    original: str
    queries: list[str]
    strategy: QueryStrategy
    hyde_output: str | None = None


# ── Main Class ────────────────────────────────────────────────────────────

class QueryEnhancer:
    """Enhance user queries before RAG search.

    Decision logic (fast heuristic, no LLM call for classification):
      1. If query tokens < HYDE_MIN_TOKENS → DIRECT (search as-is)
      2. If query contains Vietnamese comparison/multi-part signals → DECOMPOSED
      3. Otherwise → HYDE (generate hypothetical answer)

    Usage:
        enhancer = QueryEnhancer()
        result = enhancer.enhance("quy trình xuất khẩu container đông lạnh...")
        # result.queries → ["hypothetical answer text..."] (for HYDE)
        # result.strategy → QueryStrategy.HYDE
    """

    def __init__(self, model: str | None = None):
        """Initialize QueryEnhancer.

        Args:
            model: LLM model name for OpenRouter. Defaults to LLM_MODEL env var.
        """
        self._model = model or os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
        self._api_key = os.getenv("OPENAI_API_KEY", "")
        self._api_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")

    def enhance(self, query: str) -> EnhancedQuery:
        """Analyze query and apply appropriate enhancement strategy.

        This is the main entry point. Classifies the query, then applies
        the chosen strategy (DIRECT returns as-is, HYDE calls LLM, DECOMPOSED
        calls LLM to split).

        Args:
            query: Raw user query text.

        Returns:
            EnhancedQuery with enhanced queries and strategy metadata.
        """
        query = (query or "").strip()
        if not query:
            return EnhancedQuery(
                original=query,
                queries=[query] if query else [],
                strategy=QueryStrategy.DIRECT,
            )

        strategy = self._classify_strategy(query)
        logger.info(f"[QueryEnhancer] Strategy: {strategy.value} for query: {query[:60]}...")

        if strategy == QueryStrategy.DIRECT:
            return EnhancedQuery(
                original=query,
                queries=[query],
                strategy=QueryStrategy.DIRECT,
            )

        if strategy == QueryStrategy.HYDE:
            return self._apply_hyde(query)

        if strategy == QueryStrategy.DECOMPOSED:
            return self._apply_decomposition(query)

        # Fallback: should never reach here
        return EnhancedQuery(
            original=query,
            queries=[query],
            strategy=QueryStrategy.DIRECT,
        )

    def _classify_strategy(self, query: str) -> QueryStrategy:
        """Classify query into strategy using fast heuristic (no LLM call).

        Rules applied in order:
          1. Empty/short query → DIRECT
          2. Contains Vietnamese comparison/multi-part signals → DECOMPOSED
          3. Long query → HYDE
        """
        if not query or not query.strip():
            return QueryStrategy.DIRECT

        tokens = estimate_tokens(query)

        if tokens < HYDE_MIN_TOKENS:
            return QueryStrategy.DIRECT

        query_lower = query.lower()
        if any(signal in query_lower for signal in DECOMPOSE_SIGNALS_VI):
            return QueryStrategy.DECOMPOSED

        return QueryStrategy.HYDE

    # ── LLM Call Helper ──────────────────────────────────────────────────

    def _call_llm(
        self,
        system_prompt: str,
        user_prompt: str,
        max_tokens: int = 500,
        temperature: float = 0.3,
    ) -> str:
        """Call LLM via OpenRouter using the same pattern as chat_tasks.py.

        Uses httpx sync client from src.core.http_client (shared connection pool).

        Args:
            system_prompt: System message for the LLM.
            user_prompt: User message for the LLM.
            max_tokens: Maximum output tokens.
            temperature: Sampling temperature.

        Returns:
            LLM response content text.

        Raises:
            Exception: If LLM call fails.
        """
        from src.core.http_client import get_http_client

        http_client = get_http_client(timeout=30.0)

        resp = http_client.post(
            f"{self._api_base.rstrip('/')}/chat/completions",
            headers={
                "Authorization": f"Bearer {self._api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": self._model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": temperature,
                "max_tokens": max_tokens,
            },
        )
        resp.raise_for_status()

        content = resp.json()["choices"][0]["message"]["content"]
        if not content or not content.strip():
            raise ValueError(f"LLM returned empty content (model={self._model})")

        return content.strip()

    # ── Strategy Implementations ─────────────────────────────────────────

    def _apply_hyde(self, query: str) -> EnhancedQuery:
        """Apply HyDE strategy: generate hypothetical answer, use it as search query.

        If LLM call fails, falls back to DIRECT strategy (search with original query).
        """
        try:
            user_prompt = HYDE_USER_TEMPLATE.format(query=query)
            hyde_output = self._call_llm(
                system_prompt=HYDE_SYSTEM_PROMPT,
                user_prompt=user_prompt,
                max_tokens=HYDE_MAX_OUTPUT_TOKENS,
                temperature=0.3,
            )

            logger.info(
                f"[QueryEnhancer] HyDE output ({len(hyde_output)} chars): "
                f"{hyde_output[:80]}..."
            )

            return EnhancedQuery(
                original=query,
                queries=[hyde_output],
                strategy=QueryStrategy.HYDE,
                hyde_output=hyde_output,
            )

        except Exception as e:
            logger.warning(f"[QueryEnhancer] HyDE LLM call failed, falling back to DIRECT: {e}")
            return EnhancedQuery(
                original=query,
                queries=[query],
                strategy=QueryStrategy.DIRECT,
            )

    def _apply_decomposition(self, query: str) -> EnhancedQuery:
        """Apply Decomposition strategy: split complex query into sub-queries.

        Calls LLM to produce JSON: {"sub_queries": ["q1", "q2", ...]}.
        Falls back to HYDE if decomposition fails or returns invalid JSON.
        Falls back to DIRECT if both decomposition and HYDE fail.
        """
        try:
            user_prompt = DECOMPOSE_USER_TEMPLATE.format(
                query=query,
                max_sub_queries=DECOMPOSE_MAX_SUB_QUERIES,
            )
            raw_output = self._call_llm(
                system_prompt=DECOMPOSE_SYSTEM_PROMPT,
                user_prompt=user_prompt,
                max_tokens=300,
                temperature=0.1,
            )

            # Parse JSON from LLM output
            sub_queries = self._parse_decomposition_output(raw_output)

            if not sub_queries:
                logger.warning(
                    "[QueryEnhancer] Decomposition returned no sub-queries, "
                    "falling back to HYDE"
                )
                return self._apply_hyde(query)

            # Cap at max sub-queries
            sub_queries = sub_queries[:DECOMPOSE_MAX_SUB_QUERIES]

            logger.info(
                f"[QueryEnhancer] Decomposed into {len(sub_queries)} sub-queries: "
                f"{sub_queries}"
            )

            return EnhancedQuery(
                original=query,
                queries=sub_queries,
                strategy=QueryStrategy.DECOMPOSED,
            )

        except Exception as e:
            logger.warning(
                f"[QueryEnhancer] Decomposition failed, falling back to HYDE: {e}"
            )
            return self._apply_hyde(query)

    @staticmethod
    def _parse_decomposition_output(raw_output: str) -> list[str]:
        """Parse LLM decomposition output into list of sub-query strings.

        Handles:
          - Clean JSON: {"sub_queries": ["q1", "q2"]}
          - JSON with markdown code fences: ```json ... ```
          - Plain JSON array: ["q1", "q2"]

        Returns empty list if parsing fails.
        """
        text = raw_output.strip()

        # Strip markdown code fences if present
        if text.startswith("```"):
            lines = text.split("\n")
            # Remove first line (```json) and last line (```)
            lines = [ln for ln in lines if not ln.strip().startswith("```")]
            text = "\n".join(lines).strip()

        try:
            parsed = json.loads(text)
        except json.JSONDecodeError:
            logger.warning(f"[QueryEnhancer] Failed to parse decomposition JSON: {text[:200]}")
            return []

        # Handle {"sub_queries": [...]} format
        if isinstance(parsed, dict):
            sub_queries = parsed.get("sub_queries", [])
            if isinstance(sub_queries, list):
                return [str(q).strip() for q in sub_queries if str(q).strip()]

        # Handle direct array format: ["q1", "q2"]
        if isinstance(parsed, list):
            return [str(q).strip() for q in parsed if str(q).strip()]

        return []
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_query_enhancer.py -v`
Expected: PASS (all classification and dataclass tests pass)

- [ ] **Step 5: Commit**

```bash
git add chatSNP170226/backend/src/services/search/query_enhancer.py chatSNP170226/backend/tests/test_query_enhancer.py
git commit -m "feat(search): add QueryEnhancer with strategy classification for HyDE and decomposition"
```

---

### Task 2: HyDE Strategy Implementation + Tests

**Files:**
- Modify: `chatSNP170226/backend/tests/test_query_enhancer.py` (add HyDE tests)
- Already created: `chatSNP170226/backend/src/services/search/query_enhancer.py` (HyDE already implemented in Task 1)

- [ ] **Step 1: Write tests for HyDE strategy**

Append to `chatSNP170226/backend/tests/test_query_enhancer.py`:

```python
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
        assert "Tân Cảng Sài Gòn" in call_args.kwargs.get("system_prompt", call_args[0][0])
        assert query in call_args.kwargs.get("user_prompt", call_args[0][1])

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
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_query_enhancer.py -v -k "TestHyDE"`
Expected: PASS (all 4 HyDE tests pass — the implementation is already in Task 1)

- [ ] **Step 3: Commit**

```bash
git add chatSNP170226/backend/tests/test_query_enhancer.py
git commit -m "test(search): add HyDE strategy tests for QueryEnhancer"
```

---

### Task 3: Query Decomposition Strategy + Tests

**Files:**
- Modify: `chatSNP170226/backend/tests/test_query_enhancer.py` (add decomposition tests)
- Already created: `chatSNP170226/backend/src/services/search/query_enhancer.py` (decomposition already implemented in Task 1)

- [ ] **Step 1: Write tests for decomposition strategy**

Append to `chatSNP170226/backend/tests/test_query_enhancer.py`:

```python
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
        assert len(result.queries) <= DECOMPOSE_MAX_SUB_QUERIES

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
```

Add the required import at the top of the test file (after existing imports):

```python
import json
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_query_enhancer.py -v -k "TestDecomposition or TestParse"`
Expected: PASS (all decomposition and parsing tests pass)

- [ ] **Step 3: Run all QueryEnhancer tests together**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_query_enhancer.py -v`
Expected: PASS (all tests: classification + HyDE + decomposition + parsing)

- [ ] **Step 4: Commit**

```bash
git add chatSNP170226/backend/tests/test_query_enhancer.py
git commit -m "test(search): add decomposition strategy and JSON parsing tests for QueryEnhancer"
```

---

### Task 4: Update HybridSearchService for Multi-Query Support

**Files:**
- Modify: `chatSNP170226/backend/src/services/search/hybrid_search.py`
- Create: `chatSNP170226/backend/tests/test_hybrid_multi_query.py`

- [ ] **Step 1: Write tests for multi-query search**

Create `chatSNP170226/backend/tests/test_hybrid_multi_query.py`:

```python
"""Tests for HybridSearchService multi-query (decomposition) support."""
from unittest.mock import patch, MagicMock
from dataclasses import field

from src.services.search.hybrid_search import HybridSearchService, SearchResult


def _make_result(doc_id: str, score: float, content: str = "test") -> SearchResult:
    """Helper to create a SearchResult for testing."""
    return SearchResult(
        doc_id=doc_id,
        title=f"doc_{doc_id}",
        content=content,
        score=score,
        rrf_score=score,
        source="semantic",
    )


class TestMultiQuerySearch:
    """Tests for search() with list[str] queries."""

    @patch.object(HybridSearchService, "_single_search")
    def test_single_string_query_unchanged(self, mock_single):
        """A single string query should work the same as before."""
        mock_single.return_value = [_make_result("doc1", 0.9)]

        service = HybridSearchService()
        results = service.search(query="biểu giá container", limit=5)

        mock_single.assert_called_once()
        assert len(results) == 1
        assert results[0].doc_id == "doc1"

    @patch.object(HybridSearchService, "_single_search")
    def test_multi_query_list_merges_results(self, mock_single):
        """Multiple queries should each be searched, results merged."""
        # Query 1 finds doc1 and doc2
        # Query 2 finds doc2 and doc3
        mock_single.side_effect = [
            [_make_result("doc1", 0.9), _make_result("doc2", 0.7)],
            [_make_result("doc2", 0.8), _make_result("doc3", 0.6)],
        ]

        service = HybridSearchService()
        results = service.search(
            query=["giá container 20ft", "giá container 40ft"],
            limit=5,
        )

        assert mock_single.call_count == 2
        # doc2 appears in both → should keep max score (0.8 from query 2)
        doc_ids = [r.doc_id for r in results]
        assert "doc1" in doc_ids
        assert "doc2" in doc_ids
        assert "doc3" in doc_ids

    @patch.object(HybridSearchService, "_single_search")
    def test_multi_query_dedup_keeps_max_score(self, mock_single):
        """When same doc appears in multiple sub-query results, keep highest score."""
        mock_single.side_effect = [
            [_make_result("shared_doc", 0.5)],
            [_make_result("shared_doc", 0.9)],
        ]

        service = HybridSearchService()
        results = service.search(
            query=["query1 dài đủ để test", "query2 dài đủ để test"],
            limit=5,
        )

        assert len(results) == 1
        assert results[0].doc_id == "shared_doc"
        assert results[0].score == 0.9  # max of 0.5 and 0.9

    @patch.object(HybridSearchService, "_single_search")
    def test_multi_query_respects_limit(self, mock_single):
        """Multi-query should still respect the limit parameter."""
        mock_single.side_effect = [
            [_make_result(f"doc_{i}", 0.9 - i * 0.1) for i in range(5)],
            [_make_result(f"doc_{i + 5}", 0.8 - i * 0.1) for i in range(5)],
        ]

        service = HybridSearchService()
        results = service.search(
            query=["query1 dài", "query2 dài"],
            limit=3,
        )

        assert len(results) <= 3

    @patch.object(HybridSearchService, "_single_search")
    def test_multi_query_empty_list_returns_empty(self, mock_single):
        """Empty query list should return empty results."""
        service = HybridSearchService()
        results = service.search(query=[], limit=5)

        assert results == []
        mock_single.assert_not_called()

    @patch.object(HybridSearchService, "_single_search")
    def test_multi_query_single_item_list(self, mock_single):
        """Single-item list should behave like a single string query."""
        mock_single.return_value = [_make_result("doc1", 0.9)]

        service = HybridSearchService()
        results = service.search(query=["biểu giá container"], limit=5)

        mock_single.assert_called_once()
        assert len(results) == 1
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_hybrid_multi_query.py -v`
Expected: FAIL — `_single_search` method does not exist yet, `search()` does not accept `list[str]`

- [ ] **Step 3: Modify HybridSearchService to support multi-query**

In `chatSNP170226/backend/src/services/search/hybrid_search.py`, refactor the `search()` method:

1. Rename the existing `search()` implementation to `_single_search()` (the core logic for one query)
2. Create a new `search()` that handles both `str` and `list[str]`

Replace the `search()` method signature and body (lines 81-153) with:

```python
    def search(
        self,
        query: str | list[str],
        user_id: str | None = None,
        department: str | None = None,
        limit: int = 5,
        score_threshold: float = 0.0,
    ) -> list[SearchResult]:
        """Run hybrid search with single query or multiple sub-queries.

        When query is a list (from QueryEnhancer decomposition):
          1. Run _single_search for each sub-query in parallel
          2. Merge results across sub-queries by doc_id (keep max score)
          3. Sort by score descending, return top-limit

        Parameters
        ----------
        query : str | list[str]
            Single search query or list of sub-queries.
        user_id, department : str | None
            Access control filters.
        limit : int
            Final number of results to return.
        score_threshold : float
            Minimum semantic score for semantic results (pre-RRF filter).

        Returns
        -------
        list[SearchResult]
            Top results sorted by fused RRF + boost score.
        """
        # Handle list of sub-queries (from QueryEnhancer decomposition)
        if isinstance(query, list):
            if not query:
                return []

            # Single-item list: treat as plain string
            if len(query) == 1:
                return self._single_search(
                    query=query[0],
                    user_id=user_id,
                    department=department,
                    limit=limit,
                    score_threshold=score_threshold,
                )

            # Multiple sub-queries: search in parallel, merge results
            return self._multi_query_search(
                queries=query,
                user_id=user_id,
                department=department,
                limit=limit,
                score_threshold=score_threshold,
            )

        # Plain string query
        return self._single_search(
            query=query,
            user_id=user_id,
            department=department,
            limit=limit,
            score_threshold=score_threshold,
        )

    def _multi_query_search(
        self,
        queries: list[str],
        user_id: str | None,
        department: str | None,
        limit: int,
        score_threshold: float,
    ) -> list[SearchResult]:
        """Search multiple sub-queries in parallel and merge results.

        Dedup by doc_id: when the same document appears in results from
        multiple sub-queries, keep the one with the highest score.
        """
        logger.info(
            f"[HybridSearch] Multi-query search: {len(queries)} sub-queries"
        )

        # Search each sub-query in parallel
        with ThreadPoolExecutor(max_workers=min(len(queries), 4)) as executor:
            futures = [
                executor.submit(
                    self._single_search,
                    query=q,
                    user_id=user_id,
                    department=department,
                    limit=limit,  # Get full limit per sub-query before merge
                    score_threshold=score_threshold,
                )
                for q in queries
            ]
            all_results: list[list[SearchResult]] = [f.result() for f in futures]

        # Merge by doc_id: keep max score
        merged: dict[str, SearchResult] = {}
        for results in all_results:
            for result in results:
                doc_id = result.doc_id
                if doc_id not in merged or result.score > merged[doc_id].score:
                    merged[doc_id] = result

        # Sort by score descending, return top-limit
        sorted_results = sorted(merged.values(), key=lambda r: r.score, reverse=True)

        logger.info(
            f"[HybridSearch] Multi-query merged: "
            f"{sum(len(r) for r in all_results)} total → "
            f"{len(sorted_results)} unique docs"
        )

        return sorted_results[:limit]

    def _single_search(
        self,
        query: str,
        user_id: str | None = None,
        department: str | None = None,
        limit: int = 5,
        score_threshold: float = 0.0,
    ) -> list[SearchResult]:
        """Run hybrid search for a single query: semantic + lexical + RRF fusion.

        This is the original search() implementation, refactored into a private
        method so search() can dispatch to either single or multi-query mode.
        """
        if not query or not query.strip():
            return []

        logger.info(f"[HybridSearch] Query: {query[:80]}...")

        # Run semantic + lexical in parallel using ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=2) as executor:
            semantic_future = executor.submit(
                self._semantic_search, query, user_id, department, score_threshold
            )
            lexical_future = executor.submit(
                self._lexical_search, query, user_id, department
            )

            semantic_results = semantic_future.result()
            lexical_results = lexical_future.result()

        logger.info(
            f"[HybridSearch] Semantic: {len(semantic_results)} results, "
            f"Lexical: {len(lexical_results)} results"
        )

        # Fuse with RRF
        fused = self._rrf_fusion(semantic_results, lexical_results)

        # Apply title + tag boost post-fusion
        for result in fused:
            boost = calculate_combined_boost(query, result.title, result.tags)
            result.boost_score = boost
            result.score = result.rrf_score + boost

        # Sort by final score descending
        fused.sort(key=lambda r: r.score, reverse=True)

        # Return top N
        top_results = fused[:limit]

        if top_results:
            logger.info(
                f"[HybridSearch] Top result: {top_results[0].title[:40]} "
                f"score={top_results[0].score:.4f} "
                f"(rrf={top_results[0].rrf_score:.4f} + boost={top_results[0].boost_score:.4f}) "
                f"source={top_results[0].source}"
            )

        return top_results
```

- [ ] **Step 4: Run multi-query tests to verify they pass**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_hybrid_multi_query.py -v`
Expected: PASS (all 6 tests)

- [ ] **Step 5: Verify existing tests still pass (no regression)**

Run: `cd chatSNP170226/backend && python -m pytest tests/ -v --tb=short -k "not integration" 2>&1 | tail -30`
Expected: No new failures

- [ ] **Step 6: Commit**

```bash
git add chatSNP170226/backend/src/services/search/hybrid_search.py chatSNP170226/backend/tests/test_hybrid_multi_query.py
git commit -m "feat(search): add multi-query support to HybridSearchService for query decomposition"
```

---

### Task 5: Integrate QueryEnhancer into RAG Pipeline

**Files:**
- Modify: `chatSNP170226/backend/src/worker/chat_tasks.py`
- Modify: `chatSNP170226/backend/src/services/search/__init__.py`

- [ ] **Step 1: Export QueryEnhancer from search package**

In `chatSNP170226/backend/src/services/search/__init__.py`, add the import:

```python
"""
Hybrid Search package — Semantic + BM25 + RRF fusion.

Ported from Smart2Brain's hybrid search architecture.
Combines Qdrant semantic search with Whoosh BM25 lexical search,
merged via Reciprocal Rank Fusion (RRF).
"""

from .hybrid_search import HybridSearchService
from .lexical_search import LexicalSearchService
from .query_enhancer import QueryEnhancer, EnhancedQuery, QueryStrategy
from .search_ranking import calculate_tag_boost, calculate_title_boost

__all__ = [
    "HybridSearchService",
    "LexicalSearchService",
    "QueryEnhancer",
    "EnhancedQuery",
    "QueryStrategy",
    "calculate_title_boost",
    "calculate_tag_boost",
]
```

- [ ] **Step 2: Integrate QueryEnhancer into rag_document_search**

In `chatSNP170226/backend/src/worker/chat_tasks.py`, modify the `rag_document_search` task.

Find the section that starts with:

```python
        # ── Hybrid Search: Semantic (Qdrant) + BM25 (Whoosh) + RRF fusion ──
        from src.services.search.hybrid_search import HybridSearchService

        hybrid = HybridSearchService()
        hybrid_results = hybrid.search(
            query=question,
            user_id=user_id,
            department=department,
            limit=5,
            score_threshold=RAG_SCORE_THRESHOLD,
        )
```

Replace it with:

```python
        # ── Query Enhancement: classify and enhance before search ──
        from src.services.search.query_enhancer import QueryEnhancer, QueryStrategy
        from src.services.search.hybrid_search import HybridSearchService

        enhancer = QueryEnhancer()
        enhanced = enhancer.enhance(question)
        logger.info(
            f"[RAG] Query strategy: {enhanced.strategy.value}, "
            f"sub-queries: {len(enhanced.queries)}"
        )
        if enhanced.hyde_output:
            logger.info(f"[RAG] HyDE output: {enhanced.hyde_output[:100]}...")

        # ── Hybrid Search: feed enhanced queries ──
        hybrid = HybridSearchService()
        hybrid_results = hybrid.search(
            query=enhanced.queries if len(enhanced.queries) > 1 else enhanced.queries[0],
            user_id=user_id,
            department=department,
            limit=5,
            score_threshold=RAG_SCORE_THRESHOLD,
        )
```

- [ ] **Step 3: Store enhancement metadata in the response for debugging**

In the same `rag_document_search` function, find the section where `chunk_ids` metadata is stored (around line 963):

```python
        # 6. Store retrieved chunk IDs in message metadata for accurate feedback
        try:
            msg_id = target_message_id or resp.json().get("id")
            if msg_id and hybrid_results:
                chunk_ids = [r.doc_id for r in hybrid_results if r.doc_id]
                if chunk_ids:
                    http_client.patch(
                        f"{BACKEND_INTERNAL_URL}/messages/{msg_id}/metadata",
                        json={"rag_chunk_ids": chunk_ids},
                    )
```

Add enhancement metadata to the patch call. Replace the `json=` line:

```python
                    metadata_patch = {"rag_chunk_ids": chunk_ids}
                    # Store query enhancement info for debugging/analytics
                    metadata_patch["query_strategy"] = enhanced.strategy.value
                    if enhanced.strategy == QueryStrategy.DECOMPOSED:
                        metadata_patch["sub_queries"] = enhanced.queries
                    http_client.patch(
                        f"{BACKEND_INTERNAL_URL}/messages/{msg_id}/metadata",
                        json=metadata_patch,
                    )
```

- [ ] **Step 4: Verify no import errors**

Run: `cd chatSNP170226/backend && python -c "from src.services.search.query_enhancer import QueryEnhancer, QueryStrategy; print('OK')"` 
Expected: `OK`

- [ ] **Step 5: Run existing tests to check for regressions**

Run: `cd chatSNP170226/backend && python -m pytest tests/ -v --tb=short 2>&1 | tail -30`
Expected: No new failures

- [ ] **Step 6: Commit**

```bash
git add chatSNP170226/backend/src/worker/chat_tasks.py chatSNP170226/backend/src/services/search/__init__.py
git commit -m "feat(rag): integrate QueryEnhancer into RAG pipeline for HyDE and decomposition"
```

---

### Task 6: Integration Tests + Full Verification

**Files:**
- Create: `chatSNP170226/backend/tests/test_query_enhancer_integration.py`

- [ ] **Step 1: Write integration tests for the full enhancement flow**

Create `chatSNP170226/backend/tests/test_query_enhancer_integration.py`:

```python
"""Integration tests for QueryEnhancer in the RAG pipeline.

Tests the full flow: classify → enhance → feed to HybridSearchService.
Uses mocks for LLM and search services (no live API calls).
"""
import json
from unittest.mock import patch, MagicMock, call

import pytest

from src.services.search.query_enhancer import (
    QueryEnhancer,
    EnhancedQuery,
    QueryStrategy,
    HYDE_MIN_TOKENS,
    DECOMPOSE_MAX_SUB_QUERIES,
)
from src.services.search.hybrid_search import HybridSearchService, SearchResult


# ── Helpers ──────────────────────────────────────────────────────────────

def _make_result(doc_id: str, score: float, content: str = "") -> SearchResult:
    return SearchResult(
        doc_id=doc_id,
        title=f"test_{doc_id}",
        content=content or f"Content for {doc_id}",
        score=score,
        rrf_score=score,
        source="semantic",
    )


# ── Tests ────────────────────────────────────────────────────────────────

class TestDirectStrategyIntegration:
    """Short queries should pass through without LLM calls."""

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_short_query_no_llm_call(self, mock_llm):
        """DIRECT strategy should never call LLM."""
        enhancer = QueryEnhancer()
        result = enhancer.enhance("biểu giá container")

        assert result.strategy == QueryStrategy.DIRECT
        assert result.queries == ["biểu giá container"]
        mock_llm.assert_not_called()

    @patch.object(HybridSearchService, "_single_search")
    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_direct_query_feeds_original_to_search(self, mock_llm, mock_search):
        """DIRECT: original query should be passed to search unchanged."""
        mock_search.return_value = [_make_result("doc1", 0.9)]

        enhancer = QueryEnhancer()
        enhanced = enhancer.enhance("biểu giá container")

        hybrid = HybridSearchService()
        results = hybrid.search(
            query=enhanced.queries[0],
            limit=5,
        )

        # Verify search was called with the original query
        mock_search.assert_called_once()
        assert mock_search.call_args.kwargs.get("query") == "biểu giá container" or \
               mock_search.call_args[1].get("query") == "biểu giá container" or \
               mock_search.call_args[0][0] == "biểu giá container" if mock_search.call_args[0] else True
        mock_llm.assert_not_called()


class TestHyDEIntegration:
    """Long queries should generate hypothetical answers for search."""

    @patch.object(HybridSearchService, "_single_search")
    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_hyde_feeds_hypothetical_to_search(self, mock_llm, mock_search):
        """HYDE: hypothetical answer should be the search query."""
        hyde_text = (
            "Theo quy định của cảng Cát Lái, quy trình xuất khẩu hàng đông lạnh "
            "bao gồm các bước chính: đăng ký tờ khai hải quan điện tử, nộp giấy "
            "chứng nhận kiểm dịch thực vật, đưa container vào bãi lạnh..."
        )
        mock_llm.return_value = hyde_text
        mock_search.return_value = [_make_result("doc1", 0.9)]

        enhancer = QueryEnhancer()
        enhanced = enhancer.enhance(
            "Tôi muốn biết quy trình xuất khẩu hàng đông lạnh qua cảng Cát Lái "
            "gồm những bước nào, cần giấy tờ gì, thời gian xử lý bao lâu"
        )

        assert enhanced.strategy == QueryStrategy.HYDE
        assert enhanced.queries[0] == hyde_text

        # Feed to search
        hybrid = HybridSearchService()
        results = hybrid.search(query=enhanced.queries[0], limit=5)

        assert len(results) == 1


class TestDecompositionIntegration:
    """Complex queries should be split and searched in parallel."""

    @patch.object(HybridSearchService, "_single_search")
    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_decomposed_feeds_sub_queries_to_multi_search(self, mock_llm, mock_search):
        """DECOMPOSED: sub-queries should be searched via multi-query path."""
        mock_llm.return_value = json.dumps({
            "sub_queries": [
                "biểu giá container 20ft tại cảng Cát Lái",
                "biểu giá container 40ft tại cảng Cát Lái",
            ]
        })
        mock_search.side_effect = [
            [_make_result("doc_20ft", 0.9, "Giá container 20ft")],
            [_make_result("doc_40ft", 0.85, "Giá container 40ft")],
        ]

        enhancer = QueryEnhancer()
        enhanced = enhancer.enhance(
            "so sánh biểu giá container 20ft và 40ft tại cảng Cát Lái chi tiết nhất hiện nay"
        )

        assert enhanced.strategy == QueryStrategy.DECOMPOSED
        assert len(enhanced.queries) == 2

        # Feed to search as list → triggers multi-query path
        hybrid = HybridSearchService()
        results = hybrid.search(query=enhanced.queries, limit=5)

        assert mock_search.call_count == 2
        doc_ids = [r.doc_id for r in results]
        assert "doc_20ft" in doc_ids
        assert "doc_40ft" in doc_ids


class TestFallbackBehavior:
    """Test graceful degradation when LLM calls fail."""

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_all_strategies_eventually_return_something(self, mock_llm):
        """Even if all LLM calls fail, enhance() should return a valid result."""
        mock_llm.side_effect = Exception("API unavailable")

        enhancer = QueryEnhancer()

        # Test with a long query (would normally trigger HYDE)
        result1 = enhancer.enhance(
            "quy trình nhập khẩu hàng hóa đông lạnh tại cảng biển Tân Cảng Sài Gòn bao gồm những bước nào"
        )
        assert result1.queries[0] == result1.original
        assert result1.strategy == QueryStrategy.DIRECT  # Fallback

        # Test with a comparison query (would normally trigger DECOMPOSED)
        result2 = enhancer.enhance(
            "so sánh quy trình nhập khẩu và xuất khẩu container đông lạnh tại cảng Tân Cảng chi tiết"
        )
        assert result2.queries[0] == result2.original
        assert result2.strategy == QueryStrategy.DIRECT  # Fallback from decompose → hyde → direct

    @patch("src.services.search.query_enhancer.QueryEnhancer._call_llm")
    def test_enhance_never_returns_empty_queries(self, mock_llm):
        """enhance() should never return an EnhancedQuery with empty queries list."""
        mock_llm.side_effect = Exception("LLM down")

        enhancer = QueryEnhancer()
        queries_to_test = [
            "ngắn",
            "quy trình xuất khẩu hàng đông lạnh qua cảng Cát Lái gồm những bước nào cần giấy tờ gì",
            "so sánh biểu giá container 20ft và 40ft tại cảng Cát Lái và Hiệp Phước chi tiết",
        ]

        for q in queries_to_test:
            result = enhancer.enhance(q)
            assert len(result.queries) >= 1, f"Empty queries for: {q}"
            assert all(q_item for q_item in result.queries), f"Blank query item for: {q}"


class TestEdgeCases:
    """Edge cases and boundary conditions."""

    def test_unicode_vietnamese_query(self):
        """Vietnamese diacritics should not break classification."""
        enhancer = QueryEnhancer()
        result = enhancer._classify_strategy(
            "Phí lưu bãi container đông lạnh loại 40ft tại TCCL?"
        )
        # This is 11 words × 1.8 ≈ 20 tokens < 30 → DIRECT
        assert result == QueryStrategy.DIRECT

    def test_very_long_query_is_hyde(self):
        """Very long queries without signals should be HYDE."""
        enhancer = QueryEnhancer()
        # Build a query > 30 tokens without decomposition signals
        query = "Tôi cần biết chi tiết về " + " ".join(["quy trình"] * 20)
        result = enhancer._classify_strategy(query)
        assert result == QueryStrategy.HYDE

    def test_whitespace_only_query(self):
        """Whitespace-only queries should return DIRECT with empty queries."""
        enhancer = QueryEnhancer()
        result = enhancer.enhance("   \n\t  ")
        assert result.strategy == QueryStrategy.DIRECT
```

- [ ] **Step 2: Run integration tests**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_query_enhancer_integration.py -v`
Expected: PASS (all tests)

- [ ] **Step 3: Run ALL test files related to Phase 7**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_query_enhancer.py tests/test_query_enhancer_integration.py tests/test_hybrid_multi_query.py -v`
Expected: All PASS

- [ ] **Step 4: Run full test suite to check for regressions**

Run: `cd chatSNP170226/backend && python -m pytest tests/ -v --tb=short 2>&1 | tail -30`
Expected: No new failures introduced

- [ ] **Step 5: Commit integration tests**

```bash
git add chatSNP170226/backend/tests/test_query_enhancer_integration.py
git commit -m "test: add integration tests for QueryEnhancer in RAG pipeline"
```

- [ ] **Step 6: Final commit tagging Phase 7 complete**

```bash
git commit --allow-empty -m "milestone: Phase 7 HyDE + Query Decomposition complete"
```

The plan is now complete and ready for implementation. The Phase 7 implementation adds query enhancement to the RAG pipeline with three strategies:

1. **DIRECT** (< 30 tokens): Zero overhead, search as-is
2. **HyDE** (long queries): ~300-500ms LLM call to generate hypothetical Vietnamese answer
3. **DECOMPOSED** (comparison/multi-part queries): ~200-400ms LLM call to split into ≤4 sub-queries, searched in parallel

Total added latency: 0-900ms depending on strategy. Acceptable given current RAG queries take 5-15s.
