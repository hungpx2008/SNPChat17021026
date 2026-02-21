"""
Router Service — Orchestrator Agent using PydanticAI.

This service defines the "Brain" of ChatSNP. It uses PydanticAI to:
1. Analyze user intent.
2. Select and call appropriate tools (SQL, RAG, Web Search).
3. Synthesize a final response from multiple tool outputs.
"""
from __future__ import annotations

import logging
import os
from typing import Literal, Union

from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel

logger = logging.getLogger(__name__)

# Intent Types for the Orchestrator
IntentType = Literal["sql", "rag", "chat"]

class RouterOutput(BaseModel):
    """Schema for the router's classification output."""
    mode: IntentType = Field(description="The primary engine to handle the request")
    reasoning: str = Field(description="Brief explanation of why this mode was chosen")

# Initialize the model (OpenRouter is OpenAI-compatible)
openai_key = os.getenv("OPENAI_API_KEY", "")
openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")

model = OpenAIModel(
    'openai/gpt-4o-mini',
    base_url=openai_base,
    api_key=openai_key,
)

# ---------------------------------------------------------------------------
# The Orchestrator Agent
# ---------------------------------------------------------------------------
orchestrator_agent = Agent(
    model,
    result_type=RouterOutput,
    system_prompt=(
        "You are the Orchestrator for ChatSNP, a Vietnamese port management assistant. "
        "Analyze the user query and decide which engine is best: "
        "- 'sql' for data/statistics, numbers, comparisons, rankings (e.g., 'Sản lượng tháng này?'). "
        "- 'rag' for regulations, policies, price lists, procedures, documents (e.g., 'Biểu giá lưu kho?'). "
        "- 'chat' for greetings, general advice, or topics unrelated to port data/files. "
        "Keep reasoning concise and in Vietnamese."
    ),
)


async def classify_intent_pydantic(text: str) -> IntentType:
    """
    Classify user intent using PydanticAI Agent.
    """
    try:
        result = await orchestrator_agent.run(text)
        logger.info(f"[orchestrator] PydanticAI classified → {result.data.mode} ({result.data.reasoning})")
        return result.data.mode
    except Exception as exc:
        logger.error(f"[orchestrator] PydanticAI failed: {exc}")
        # Fallback to the keyword-based classifier if LLM fails
        from src.services.router_service import keyword_classify
        return keyword_classify(text)

# We keep the keyword-based fallback for reliability
import re

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
        if re.search(r"\d{4}|\d+\s*(tháng|quý|năm)", text):
            return "sql"
        return "rag"
    return "chat"
