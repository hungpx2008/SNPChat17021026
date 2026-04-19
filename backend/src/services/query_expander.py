"""
HyDE Query Expansion Service

Giải quyết vấn đề: Query ngắn (< 20 chars) → vector yếu → similarity thấp.

Solution:
  - Query "Tech stack đề xuất" → LLM expand thành:
    "Tech stack đề xuất bao gồm các công nghệ AI như mô hình embedding,
     router phân loại, và generation model để xây dựng hệ thống RAG"
  - Vector embedding từ expanded query → similarity tăng 0.5 → 0.7+

Reference: PDF [TCSGxEONSR] Phương án triển khai AI Agent.pdf (trang 2)
  "Phương án 1 – HyDE: Dùng Gemini Flash tạo câu trả lời giả định"
"""

import logging
import os
from typing import Any

logger = logging.getLogger(__name__)


class QueryExpander:
    """
    HyDE (Hypothetical Document Embedding) implementation.

    Khi user hỏi query ngắn/mơ hồ → LLM tạo "hypothetical answer" → embed answer đó.
    """

    def __init__(self):
        self.min_query_length = int(os.getenv("HYDE_MIN_QUERY_LENGTH", "15"))
        self.enabled = os.getenv("HYDE_ENABLED", "true").lower() == "true"

    async def expand_if_needed(self, query: str) -> str:
        """
        Nếu query ngắn → expand bằng HyDE.

        Args:
            query: User query gốc

        Returns:
            Expanded query hoặc query gốc
        """
        if not self.enabled:
            logger.debug("[hyde] HyDE disabled, returning original query")
            return query

        query_clean = query.strip()

        # Chỉ expand query ngắn
        if len(query_clean) >= self.min_query_length:
            logger.debug(f"[hyde] Query long enough ({len(query_clean)} chars), skip expansion")
            return query

        logger.info(f"[hyde] Expanding short query: '{query_clean}' ({len(query_clean)} chars)")

        try:
            expanded = await self._generate_hypothetical_doc(query_clean)
            logger.info(f"[hyde] Expanded → {len(expanded)} chars")
            return expanded
        except Exception as exc:
            logger.warning(f"[hyde] Expansion failed ({type(exc).__name__}): {exc}. Using original query.")
            return query

    async def _generate_hypothetical_doc(self, query: str) -> str:
        """
        Gọi LLM để tạo "hypothetical document" từ query.

        Example:
            Input: "Tech stack đề xuất"
            Output: "Tech stack đề xuất cho hệ thống AI Agent bao gồm:
                     - Mô hình Router/HyDE: Gemini Flash
                     - Embedding: vietnamese-embedding
                     - Local generation: Llama-4-Scout quantized
                     - Vector store: FAISS
                     - Cache: Redis"
        """
        from pydantic_ai import Agent
        from pydantic_ai.models.openai import OpenAIModel
        from pydantic_ai.providers.openai import OpenAIProvider

        openai_key = os.getenv("OPENAI_API_KEY", "")
        openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
        llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")

        model = OpenAIModel(
            llm_model,
            provider=OpenAIProvider(base_url=openai_base, api_key=openai_key),
        )

        hyde_agent = Agent(
            model,
            output_type=str,
            system_prompt=(
                "Bạn là chuyên gia tài liệu kỹ thuật Tân Cảng Sài Gòn. "
                "Nhiệm vụ: Từ câu hỏi ngắn của user, hãy viết một đoạn văn 2-3 câu "
                "mô tả CÂU TRẢ LỜI LÝ TƯỞNG (hypothetical answer) cho câu hỏi đó. "
                "\n\n"
                "Quy tắc:\n"
                "1. Viết bằng tiếng Việt\n"
                "2. Tập trung vào thuật ngữ kỹ thuật (tech stack, mô hình AI, kiến trúc)\n"
                "3. Độ dài: 50-100 từ\n"
                "4. KHÔNG trả lời câu hỏi thật, chỉ MÔ TẢ câu trả lời lý tưởng\n"
                "\n"
                "Ví dụ:\n"
                "Query: 'Tech stack đề xuất'\n"
                "Output: 'Tech stack đề xuất cho hệ thống AI Agent bao gồm các công nghệ "
                "như mô hình Router/HyDE sử dụng Gemini Flash, embedding model tiếng Việt, "
                "local generation với Llama-4-Scout quantized, vector store FAISS, và Redis cache.'"
            ),
        )

        prompt = f"Câu hỏi: {query}\n\nHãy mô tả câu trả lời lý tưởng (2-3 câu):"

        result = await hyde_agent.run(prompt)
        expanded = result.output.strip()

        # Fallback nếu LLM trả về rỗng
        if not expanded or len(expanded) < len(query):
            logger.warning("[hyde] LLM returned empty/short expansion, using original query")
            return query

        return expanded


# Singleton instance
_expander: QueryExpander | None = None


def get_query_expander() -> QueryExpander:
    """Get or create query expander instance."""
    global _expander
    if _expander is None:
        _expander = QueryExpander()
    return _expander


async def expand_query(query: str) -> str:
    """
    Helper function để expand query nếu cần.

    Usage:
        expanded_query = await expand_query("Tech stack đề xuất")
        # → "Tech stack đề xuất bao gồm mô hình Router Gemini Flash..."
    """
    expander = get_query_expander()
    return await expander.expand_if_needed(query)
