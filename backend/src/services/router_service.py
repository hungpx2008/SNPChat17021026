"""
Router Service — Orchestrator Agent for Intent Classification.

Uses OpenRouter (cheap model) to classify user questions into:
  - "sql"  → Data/statistics queries (Vanna)
  - "rag"  → Document search (Qdrant RAG)
  - "chat" → General conversation

Includes keyword fallback for offline/timeout scenarios.
"""
import logging
import os
import re
import time
from typing import Literal

import httpx

logger = logging.getLogger(__name__)

IntentType = Literal["sql", "rag", "chat"]

# ---------------------------------------------------------------------------
# Keyword-based fallback classifier (< 5ms, no API call)
# ---------------------------------------------------------------------------
SQL_KEYWORDS = re.compile(
    r"\b(thống kê|sản lượng|doanh thu|số liệu|so sánh|bao nhiêu|tổng|"
    r"trung bình|tỉ lệ|phần trăm|tăng|giảm|top\s?\d|xếp hạng|"
    r"tháng|quý|năm|Q[1-4]|khách hàng|container|TEU|tấn|"
    r"revenue|volume|count|total|average|sum)\b",
    re.IGNORECASE,
)

RAG_KEYWORDS = re.compile(
    r"\b(biểu giá|quy định|nội quy|hướng dẫn|văn bản|tài liệu|"
    r"quy trình|chính sách|điều khoản|thủ tục|quy chế|"
    r"an toàn|lao động|phí|lệ phí|cước|giá dịch vụ|"
    r"lưu kho|cầu bến|cầu cảng|bốc xếp|"
    r"regulation|policy|procedure|guideline)\b",
    re.IGNORECASE,
)


def keyword_classify(text: str) -> IntentType:
    """Fast regex-based classification. Used as fallback."""
    sql_score = len(SQL_KEYWORDS.findall(text))
    rag_score = len(RAG_KEYWORDS.findall(text))

    if sql_score > rag_score and sql_score >= 1:
        return "sql"
    if rag_score > sql_score and rag_score >= 1:
        return "rag"
    if sql_score == rag_score and sql_score >= 1:
        # Tie-break: if question has numbers/dates → SQL, else RAG
        if re.search(r"\d{4}|\d+\s*(tháng|quý|năm)", text):
            return "sql"
        return "rag"
    return "chat"


# ---------------------------------------------------------------------------
# LLM-based classifier (OpenRouter, ~200-500ms)
# ---------------------------------------------------------------------------
CLASSIFY_SYSTEM_PROMPT = """You are an intent classifier for a Vietnamese port management system.
Classify the user's question into EXACTLY ONE category:
- "sql" → Questions about statistics, numbers, comparisons, rankings, volumes, revenue
- "rag" → Questions about regulations, policies, price lists, procedures, documents
- "chat" → General conversation, greetings, advice, explanations

Reply with ONLY the category name: sql, rag, or chat. Nothing else."""


async def classify_intent(
    text: str,
    timeout: float = 1.5,
) -> IntentType:
    """
    Classify user intent using OpenRouter LLM with keyword fallback.
    
    Flow:
        1. Try OpenRouter API (gpt-4o-mini, ~50 tokens, <$0.0001/call)
        2. If timeout/error → fallback to keyword matching
    """
    start = time.monotonic()

    try:
        openai_key = os.getenv("OPENAI_API_KEY", "")
        openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")

        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(
                f"{openai_base.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {openai_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "openai/gpt-4o-mini",  # Cheapest, fastest
                    "messages": [
                        {"role": "system", "content": CLASSIFY_SYSTEM_PROMPT},
                        {"role": "user", "content": text[:200]},  # Cap input
                    ],
                    "temperature": 0.0,
                    "max_tokens": 5,
                },
            )
            resp.raise_for_status()
            result = resp.json()["choices"][0]["message"]["content"].strip().lower()

        elapsed = (time.monotonic() - start) * 1000
        logger.info(f"[router] LLM classified '{text[:50]}...' → {result} ({elapsed:.0f}ms)")

        if result in ("sql", "rag", "chat"):
            return result
        # LLM returned unexpected value → fallback
        return keyword_classify(text)

    except Exception as exc:
        elapsed = (time.monotonic() - start) * 1000
        logger.warning(f"[router] LLM timeout/error ({elapsed:.0f}ms): {exc}")
        # Fallback to keyword matching
        result = keyword_classify(text)
        logger.info(f"[router] Keyword fallback → {result}")
        return result
