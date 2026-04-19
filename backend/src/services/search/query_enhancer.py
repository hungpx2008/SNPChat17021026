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
        self._model = model or os.getenv("LLM_MODEL_LIGHT", "gpt-5.3-codex")
        self._api_key = os.getenv("OPENAI_API_KEY", "")
        self._api_base = os.getenv("OPENAI_BASE_URL", "https://ezaiapi.com")

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
