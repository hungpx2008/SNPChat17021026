"""
Context builder — dynamic budget-based context assembly.

Ported from Smart2Brain architecture. Replaces hardcoded "LIMIT 6" message
retrieval with intelligent budget allocation that maximizes context usage.

Budget allocation logic:
  1. budget = context_window * 0.85 (reserve 15% for response)
  2. Deduct system prompt tokens (mandatory)
  3. Deduct long-term memories (mandatory, usually small)
  4. Fit recent messages into 50% of remaining budget (newest first)
  5. Fit summary into remaining budget (skip if no room)
  6. Fit RAG context into remaining budget (truncate if needed)
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field

from src.utils.token_estimator import (
    SYSTEM_PROMPT_OVERHEAD,
    estimate_tokens,
    get_context_window,
)

logger = logging.getLogger(__name__)

# ── Budget constants ──────────────────────────────────────────────────────
RESPONSE_RESERVE_RATIO = 0.15  # 15% reserved for LLM response
MESSAGES_BUDGET_RATIO = 0.50   # 50% of remaining budget for recent messages


@dataclass
class ContextBudgetReport:
    """Diagnostic info about how the budget was allocated."""

    context_window: int = 0
    total_budget: int = 0
    system_prompt_tokens: int = 0
    memories_tokens: int = 0
    messages_tokens: int = 0
    messages_included: int = 0
    messages_total: int = 0
    summary_tokens: int = 0
    rag_tokens: int = 0
    remaining_tokens: int = 0


@dataclass
class BuiltContext:
    """Result of context building — everything the LLM needs."""

    system_prompt: str = ""
    long_term_block: str = ""
    summary_block: str = ""
    recent_block: str = ""
    rag_context: str = ""
    messages: list[dict] = field(default_factory=list)
    budget_report: ContextBudgetReport = field(default_factory=ContextBudgetReport)


class ContextBuilder:
    """Build optimized context within a token budget.

    Parameters
    ----------
    model : str
        Model identifier (e.g. "openai/gpt-4o-mini") for context window lookup.
    context_window : int | None
        Override context window size. If None, looked up from model.
    """

    def __init__(self, model: str, context_window: int | None = None):
        self.model = model
        self.context_window = context_window or get_context_window(model)

    def build_context(
        self,
        system_prompt: str,
        memories: list[str] | None = None,
        summary: str = "",
        messages: list[dict] | None = None,
        rag_context: str = "",
    ) -> BuiltContext:
        """Assemble context within the token budget.

        Parameters
        ----------
        system_prompt : str
            The system prompt (mandatory, always included).
        memories : list[str] | None
            Long-term memory items from Mem0 (mandatory, usually small).
        summary : str
            Session summary text (included if budget permits).
        messages : list[dict] | None
            All conversation messages (newest-first fitting).
            Each dict should have ``role`` and ``content``.
        rag_context : str
            Retrieved document context (truncated if needed).

        Returns
        -------
        BuiltContext
            Assembled context with all blocks and budget report.
        """
        memories = memories or []
        messages = messages or []

        report = ContextBudgetReport()
        report.context_window = self.context_window
        report.messages_total = len(messages)

        # Step 1: Total budget = context_window * 0.85
        total_budget = int(self.context_window * (1 - RESPONSE_RESERVE_RATIO))
        report.total_budget = total_budget
        remaining = total_budget

        # Step 2: Deduct system prompt (mandatory)
        sys_tokens = estimate_tokens(system_prompt) + SYSTEM_PROMPT_OVERHEAD
        report.system_prompt_tokens = sys_tokens
        remaining -= sys_tokens

        # Step 3: Deduct long-term memories (mandatory, usually small)
        mem_text = "\n".join(f"- {m}" for m in memories if m) if memories else ""
        mem_tokens = estimate_tokens(mem_text)
        report.memories_tokens = mem_tokens
        remaining -= mem_tokens

        if remaining <= 0:
            logger.warning(
                "[ContextBuilder] Budget exhausted after system prompt + memories. "
                f"context_window={self.context_window}, sys={sys_tokens}, mem={mem_tokens}"
            )
            return BuiltContext(
                system_prompt=system_prompt,
                long_term_block=mem_text,
                budget_report=report,
            )

        # Step 4: Fit recent messages (50% of remaining, newest first)
        messages_budget = int(remaining * MESSAGES_BUDGET_RATIO)
        fitted_messages, msgs_used = self._fit_messages_to_budget(messages, messages_budget)
        report.messages_tokens = msgs_used
        report.messages_included = len(fitted_messages)
        remaining -= msgs_used

        # Build recent_block from fitted messages
        recent_block = ""
        if fitted_messages:
            recent_block = "\n".join(
                f"{m.get('role', 'user').upper()}: {m.get('content', '')}"
                for m in fitted_messages
            )

        # Step 5: Fit summary (skip if no room)
        summary_block = ""
        if summary and remaining > 0:
            summary_tokens = estimate_tokens(summary)
            if summary_tokens <= remaining:
                summary_block = summary
                report.summary_tokens = summary_tokens
                remaining -= summary_tokens
            else:
                # Truncate summary to fit
                summary_block = self._truncate_to_budget(summary, remaining)
                report.summary_tokens = estimate_tokens(summary_block)
                remaining -= report.summary_tokens

        # Step 6: Fit RAG context (truncate if needed)
        rag_block = ""
        if rag_context and remaining > 0:
            rag_tokens = estimate_tokens(rag_context)
            if rag_tokens <= remaining:
                rag_block = rag_context
                report.rag_tokens = rag_tokens
                remaining -= rag_tokens
            else:
                rag_block = self._truncate_to_budget(rag_context, remaining)
                report.rag_tokens = estimate_tokens(rag_block)
                remaining -= report.rag_tokens

        report.remaining_tokens = max(0, remaining)

        logger.info(
            f"[ContextBuilder] Budget: {total_budget} | "
            f"sys={report.system_prompt_tokens} mem={report.memories_tokens} "
            f"msgs={report.messages_tokens}({report.messages_included}/{report.messages_total}) "
            f"summary={report.summary_tokens} rag={report.rag_tokens} "
            f"remaining={report.remaining_tokens}"
        )

        return BuiltContext(
            system_prompt=system_prompt,
            long_term_block=mem_text,
            summary_block=summary_block,
            recent_block=recent_block,
            rag_context=rag_block,
            messages=fitted_messages,
            budget_report=report,
        )

    @staticmethod
    def _fit_messages_to_budget(
        messages: list[dict], budget: int
    ) -> tuple[list[dict], int]:
        """Select messages that fit within the token budget, newest first.

        Parameters
        ----------
        messages : list[dict]
            Messages in chronological order (oldest first).
        budget : int
            Maximum tokens available for messages.

        Returns
        -------
        tuple[list[dict], int]
            (fitted_messages_in_chronological_order, tokens_used)
        """
        if not messages or budget <= 0:
            return [], 0

        # Walk from newest to oldest, accumulate tokens
        fitted: list[dict] = []
        tokens_used = 0

        for msg in reversed(messages):
            content = msg.get("content", "") or ""
            role = msg.get("role", "") or ""
            msg_tokens = estimate_tokens(content) + estimate_tokens(role) + 4  # role/content overhead
            if tokens_used + msg_tokens > budget:
                break
            fitted.append(msg)
            tokens_used += msg_tokens

        # Reverse back to chronological order
        fitted.reverse()
        return fitted, tokens_used

    @staticmethod
    def _truncate_to_budget(text: str, budget: int) -> str:
        """Truncate text to fit within a token budget.

        Uses word-level truncation to avoid breaking mid-word.
        """
        if not text or budget <= 0:
            return ""

        words = text.split()
        result_words: list[str] = []
        current_tokens = 0

        for word in words:
            word_tokens = max(1, int(len(word.split()) * 1.8))  # quick estimate
            if current_tokens + word_tokens > budget:
                break
            result_words.append(word)
            current_tokens += word_tokens

        truncated = " ".join(result_words)
        if len(truncated) < len(text):
            truncated += "\n\n[... nội dung bị cắt do giới hạn token ...]"

        return truncated


# =============================================================================
# SystemPromptBuilder — Dynamic System Prompt (Phase 3)
# =============================================================================

# Response rules shared across all modes
_RESPONSE_RULES_VI = (
    "- Trả lời tự nhiên, lịch sự, đầy đủ ý nhưng không lan man.\n"
    "- Bạn ĐƯỢC PHÉP dùng bullet points, xuống dòng để trình bày rõ ràng nếu thông tin dài.\n"
    "- Khi context chứa dữ liệu dạng bảng (tbl_cell, row_key, col_key), "
    "BẮT BUỘC phải trình bày lại thành bảng Markdown chuẩn.\n"
    "  Ví dụ cú pháp bảng Markdown:\n"
    "  | Loại container | 20' | 40' | 45' |\n"
    "  |---|---|---|---|\n"
    "  | Hàng khô | 1.230.000 | 1.835.000 | 1.835.000 |\n"
    "- Giữ nguyên đơn vị tiền tệ gốc (VNĐ, USD). Không làm tròn, không đổi đơn vị.\n"
    "- Trích dẫn nguồn bằng cách thêm [1], [2]... vào cuối câu hoặc cuối đoạn lấy thông tin.\n"
    "- Tuyệt đối không bịa số liệu. Nếu tài liệu không đề cập, hãy nói rõ "
    "là chưa có thông tin và mời khách liên hệ hotline 1800 1188."
)

# Mode-specific tool descriptions
_MODE_TOOLS: dict[str, str] = {
    "rag": (
        "Bạn có quyền truy cập tài liệu được cung cấp trong context. "
        "Hãy dựa vào tài liệu để giải đáp chính xác, rõ ràng cho khách hàng."
    ),
    "chat": (
        "Bạn trả lời dựa trên kiến thức chung và lịch sử hội thoại. "
        "Nếu câu hỏi cần thông tin cụ thể từ tài liệu, hãy đề nghị người dùng chuyển sang chế độ RAG."
    ),
    "sql": (
        "Bạn hỗ trợ truy vấn dữ liệu từ cơ sở dữ liệu cảng. "
        "Chỉ sử dụng câu lệnh SELECT. Không DROP, DELETE, INSERT, UPDATE, hoặc ALTER."
    ),
}

# Template matching Smart2Brain prompt structure
_SYSTEM_PROMPT_TEMPLATE = """# Vai trò
Bạn là chuyên viên tư vấn nhiệt tình, chuyên nghiệp của ChatSNP (Tân Cảng Sài Gòn).

# Ngữ cảnh Người dùng
{user_context}

# Công cụ Khả dụng
{available_tools}

# Quy tắc Trả lời
{response_rules}"""


class SystemPromptBuilder:
    """Build context-aware dynamic system prompts.

    Ported from Smart2Brain ``src/agent/prompts.ts`` — ``BASE_SYSTEM_PROMPT``.
    Structure mirrors S2B's prompt sections:
      1. Role — ChatSNP port consultant (Vietnamese)
      2. User Context — Dynamic: memories, summary, recent entities, department
      3. Available Tools — Dynamic based on mode (chat/rag/sql)
      4. Response Rules — Formatting, citation, currency handling
    """

    def build(
        self,
        mode: str = "rag",
        memories: list[str] | None = None,
        session_summary: str = "",
        department: str | None = None,
    ) -> str:
        """Build a complete system prompt.

        Parameters
        ----------
        mode : str
            Agent mode: "rag", "chat", or "sql".
        memories : list[str] | None
            Long-term memory items from Mem0.
        session_summary : str
            Summary of previous conversation.
        department : str | None
            User's department for context.

        Returns
        -------
        str
            Complete system prompt.
        """
        user_context = self._build_user_context(memories, session_summary, department)
        available_tools = _MODE_TOOLS.get(mode, _MODE_TOOLS["chat"])
        return _SYSTEM_PROMPT_TEMPLATE.format(
            user_context=user_context,
            available_tools=available_tools,
            response_rules=_RESPONSE_RULES_VI,
        )

    @staticmethod
    def _build_user_context(
        memories: list[str] | None,
        session_summary: str,
        department: str | None,
    ) -> str:
        """Assemble the user context section."""
        parts: list[str] = []

        if department:
            parts.append(f"Phòng ban: {department}")

        if memories:
            mem_text = "\n".join(f"  - {m}" for m in memories if m)
            if mem_text.strip():
                parts.append(f"Thông tin đã biết về người dùng:\n{mem_text}")

        if session_summary:
            parts.append(f"Tóm tắt hội thoại trước:\n  {session_summary}")

        return "\n".join(parts) if parts else "Không có ngữ cảnh bổ sung."
