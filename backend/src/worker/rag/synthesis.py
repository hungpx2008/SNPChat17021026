"""LLM synthesis and text-cleaning helpers for RAG pipeline.

Handles calling the LLM via OpenRouter, sanitizing model output,
building fallback answers, and formatting citations.
"""
from __future__ import annotations

import logging
import os
import re
from typing import Any

from src.core.constants import RAG_SYSTEM_PROMPT

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# LLM synthesis
# ---------------------------------------------------------------------------


def _synthesize_with_llm(
    question: str,
    context_text: str,
    *,
    long_term_block: str = "",
    summary_block: str = "",
    recent_block: str = "",
    system_prompt: str = "",
) -> str:
    """Call LLM via OpenRouter to synthesize a clean answer.

    Parameters
    ----------
    system_prompt : str
        Dynamic system prompt from SystemPromptBuilder. Falls back to
        static RAG_SYSTEM_PROMPT if empty.
    """
    openai_key = os.getenv("OPENAI_API_KEY", "")
    openai_base = os.getenv("OPENAI_BASE_URL", "https://ezaiapi.com")
    llm_model = os.getenv("LLM_MODEL", "claude-opus-4-6")

    # Use dynamic prompt if provided, otherwise fall back to static
    effective_prompt = system_prompt or RAG_SYSTEM_PROMPT

    unified_context_parts = []
    if long_term_block:
        unified_context_parts.append("### Long-term Memory\n" + long_term_block)
    if summary_block:
        unified_context_parts.append("### Tóm tắt hội thoại\n" + summary_block)
    if recent_block:
        unified_context_parts.append("### Hội thoại gần đây\n" + recent_block)
    unified_context_parts.append("### Đoạn trích tài liệu (đã đánh số)\n" + context_text)
    unified_context = "\n\n".join(unified_context_parts)

    user_prompt = (
        f"Câu hỏi người dùng: {question}\n\n"
        "Context:\n\n"
        f"{unified_context}\n\n"
        "Yêu cầu: Hãy phân tích kỹ Context để trả lời đầy đủ, chi tiết "
        "(được phép định dạng bảng, bullet nếu cần thiết)."
    )
    from src.core.http_client import get_http_client

    http_client = get_http_client()

    try:
        resp = http_client.post(
            f"{openai_base.rstrip('/')}/chat/completions",
            headers={
                "Authorization": f"Bearer {openai_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": llm_model,
                "messages": [
                    {"role": "system", "content": effective_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.3,
                "max_tokens": 1500,
            },
        )
        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"]
        if not content or not content.strip():
            raise ValueError(
                f"LLM returned empty content (model={llm_model}). "
                "Check LLM_MODEL in .env — ensure it supports chat completions."
            )
        return content.strip()
    except Exception as e:
        logger.error(f"[LLM] Synthesis failed: {e}")
        raise


# ---------------------------------------------------------------------------
# Text cleaning / sanitization
# ---------------------------------------------------------------------------


def _clean_snippet_text(text: str) -> str:
    """Sanitize raw snippet text before sending to LLM.

    Handles:
    - Raw HTML tags from Docling table export (<td>, <tr>, <table>, etc.)
    - Windows line endings (\\r\\n) → Unix (\\n)
    - Tab characters → space separator
    - Lines containing ONLY numbers/prices scattered across (table debris) → joined with context
    - Stray whitespace / redundant blank lines
    """
    # 0. Normalize Windows line endings
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # 1. Remove HTML tags
    text = re.sub(r"<[^>]+>", "", text)

    # 2. Convert tabs to space (prevent tab-split confusion)
    text = text.replace("\t", " ")

    # 3. Collapse multiple spaces to single space (per line)
    lines = text.splitlines()
    cleaned_lines = []
    for line in lines:
        cleaned_lines.append(re.sub(r"  +", " ", line).strip())
    text = "\n".join(cleaned_lines)

    # 4. Collapse 3+ blank lines → single blank line
    text = re.sub(r"\n{3,}", "\n\n", text)

    # 5. Remove lines that are purely whitespace
    text = "\n".join(ln for ln in text.splitlines() if ln.strip())

    return text.strip()


def _strip_markdown_tables(text: str) -> str:
    """Remove markdown table blocks from model output."""
    lines = text.splitlines()
    out: list[str] = []
    i = 0

    while i < len(lines):
        line = lines[i]
        is_table_row = bool(re.match(r"^\s*\|.*\|\s*$", line))
        is_sep_row = (
            i + 1 < len(lines)
            and bool(re.match(r"^\s*\|(?:\s*:?-+:?\s*\|)+\s*$", lines[i + 1]))
        )

        if is_table_row and is_sep_row:
            i += 2
            while i < len(lines) and re.match(r"^\s*\|.*\|\s*$", lines[i]):
                i += 1
            continue

        # Drop broken pipe-heavy lines (often malformed table debris)
        if line.count("|") >= 3 and not re.search(r"[A-Za-zÀ-ỹ0-9]", line):
            i += 1
            continue

        out.append(line)
        i += 1

    return "\n".join(out)


def _split_sentences_vi(text: str) -> list[str]:
    """Split Vietnamese text into sentences without breaking on:

    - Decimal numbers: "1.200.000 VNĐ"
    - Common abbreviations: "TP.", "Dr.", "No.", "ST.", v.v.
    - Ellipsis: "..."

    Strategy: only split on [.!?] that is followed by whitespace AND an uppercase letter
    or a Vietnamese uppercase (À-Ỹ). This avoids splitting "50.000 VNĐ. Đây là..."
    vs keeping "Dr. Nguyễn" intact.
    """
    # Protect known patterns from being split
    # 1. Replace "..." with a placeholder
    text = text.replace("...", "⟨ellipsis⟩")
    # 2. Replace decimal separators: digit.digit → protect
    text = re.sub(r"(\d)\.(\d)", r"\1⟨dot⟩\2", text)
    # 3. Replace common abbreviations: word of 1-3 uppercase letters followed by dot
    text = re.sub(
        r"\b([A-ZĐÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂẮẶẦẨẪẤẬẺẼẸỀẾỆỈỊỎỌỒỐỔỖỘỚỜỞỠỢỤỦỪỨỬỮỰỲỴỶỸ]{1,3})\.",
        r"\1⟨abbr⟩",
        text,
    )

    # Split only on sentence-ending punctuation followed by space + uppercase start
    sentences = re.split(
        r'(?<=[.!?])\s+(?=[A-ZĐÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂẮẶẦẨẪẤẬẺẼẸỀẾỆỈỊỎỌỒỐỔỖỘỚỜỞỠỢỤỦỪỨỬỮỰỲỴỶỸ])',
        text,
    )

    # Restore placeholders
    restored = []
    for s in sentences:
        s = s.replace("⟨ellipsis⟩", "...").replace("⟨dot⟩", ".").replace("⟨abbr⟩", ".")
        if s.strip():
            restored.append(s.strip())
    return restored


def _sanitize_generated_answer(text: str) -> str:
    """Normalize model output into concise, clean prose."""
    clean = text or ""

    # Remove model-generated citation footer; backend will append canonical footer later.
    clean = re.sub(
        r"(?ms)^---\s*\n📚\s*\*\*Nguồn tham khảo:\*\*[\s\S]*$",
        "",
        clean,
    ).strip()

    # Remove malformed citation list lines generated by model.
    clean = re.sub(r"(?m)^\s*-\s*\*\*\[[^\]]+\]\*\*.*$", "", clean)

    # Fix inline malformed citations like [ 1 VNĐ ] -> [1]
    clean = re.sub(r"\[\s*(\d+)\s*(?:VNĐ|VND)\s*\]", r"[\1]", clean, flags=re.IGNORECASE)

    # Normalize excess whitespace.
    clean = re.sub(r"\n{4,}", "\n\n", clean)
    clean = clean.strip()

    # Trim common dangling endings from truncated generations.
    clean = re.sub(r"(?:\s+(?:và|hoặc|cho|tại|với|là|:))\s*$", "", clean, flags=re.IGNORECASE)

    return clean


def _build_fallback_answer(context_blocks: list[str]) -> str:
    """Build a clean fallback when LLM synthesis fails."""
    if not context_blocks:
        return (
            "Chưa tìm thấy dữ liệu phù hợp trong tài liệu hiện có; "
            "bạn vui lòng nêu rõ hơn điều kiện cần tra cứu."
        )

    clean = re.sub(r'^\[\d+\]\s*', '', context_blocks[0]).strip()
    return f"Thông tin gần nhất trong tài liệu là: {clean}"


def _format_citations_footer(citations: list[dict[str, Any]]) -> str:
    """Format citations into a clean markdown footer."""
    if not citations:
        return ""

    cite_lines = ["---", "📚 **Nguồn tham khảo:**"]
    for c in citations:
        # Sanitize page: chỉ chấp nhận số hoặc "?"
        raw_page = c.get("page")
        try:
            page_str = str(int(raw_page)) if raw_page is not None else "?"
        except (ValueError, TypeError):
            page_str = "?"

        # Sanitize score: chỉ chấp nhận float hợp lệ 0–1
        raw_score = c.get("score")
        try:
            score_val = float(raw_score)
            score_str = f" — độ liên quan: {score_val:.3f}" if 0 < score_val <= 1 else ""
        except (ValueError, TypeError):
            score_str = ""

        headings = c.get("headings", [])
        headings_str = f" | mục: {headings[-1]}" if headings else ""

        cite_lines.append(
            f"- **[{c['index']}]** {c['file']} (Trang {page_str}){headings_str}{score_str}"
        )

    return "\n" + "\n".join(cite_lines)
