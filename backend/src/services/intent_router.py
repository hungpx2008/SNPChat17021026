"""Intent Router — lightweight heuristic classifier for ChatSNP agent modes.

Classifies user queries into one of three intents (chat / sql / rag) using
Vietnamese keyword and pattern matching.  No LLM call — target latency <5 ms.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from enum import Enum
from typing import ClassVar


class IntentType(str, Enum):
    CHAT = "chat"
    SQL = "sql"
    RAG = "rag"


@dataclass
class IntentResult:
    intent: IntentType
    confidence: float  # 0.0 – 1.0
    signals: list[str] = field(default_factory=list)  # matched keywords / patterns


class IntentRouter:
    """Rule-based intent classifier (Vietnamese-first).

    SQL keywords are split into *strong* (aggregate / statistic terms that
    inherently require a data lookup) and *weak* (domain nouns like
    "container" or "cảng" that appear in both data-query and document
    contexts).  Weak SQL signals only count when at least one strong SQL
    signal is also present — this avoids mis-classifying document queries
    that happen to mention port domain nouns.

    Priority order when signal counts are equal: SQL > RAG > CHAT.
    """

    # ── SQL strong signals — aggregate / statistic intent ───────────────
    SQL_STRONG_KEYWORDS: ClassVar[list[str]] = [
        "thống kê",
        "bao nhiêu",
        "số lượng",
        "tổng số",
        "tổng cộng",
        "trung bình",
        "cao nhất",
        "thấp nhất",
        "nhiều nhất",
        "ít nhất",
        "tăng trưởng",
        "so sánh",
        "phần trăm",
        "tỷ lệ",
        "sản lượng",
        "doanh thu",
        "lợi nhuận",
        "lượt xe",
    ]

    # ── SQL weak signals — domain nouns (only counted with a strong signal)
    SQL_WEAK_KEYWORDS: ClassVar[list[str]] = [
        "container",
        "teu",
        "công suất",
        "tàu",
        "chuyến tàu",
        "cảng",
        "bãi",
        # time references
        "năm 20",
        "tháng",
        "quý",
        "nửa đầu",
        "nửa cuối",
        "từ năm",
        "đến năm",
    ]

    # Regex patterns — always strong (they embed numeric context)
    SQL_PATTERNS: ClassVar[list[re.Pattern[str]]] = [
        re.compile(r"bao\s+nhiêu", re.IGNORECASE),
        re.compile(r"từ\s+\d{4}\s+đến\s+\d{4}", re.IGNORECASE),
        re.compile(r"năm\s+20\d{2}", re.IGNORECASE),
        re.compile(r"tháng\s+\d{1,2}", re.IGNORECASE),
        re.compile(r"quý\s+[1-4IiIiIiIV]", re.IGNORECASE),
        re.compile(r"top\s+\d+", re.IGNORECASE),
        re.compile(r"\d+\s*(teu|container)", re.IGNORECASE),
    ]

    # ── RAG signal keywords / phrases ───────────────────────────────────
    RAG_KEYWORDS: ClassVar[list[str]] = [
        # regulation / procedure terms
        "quy trình",
        "quy định",
        "thủ tục",
        "biểu phí",
        "hướng dẫn",
        "điều kiện",
        "điều khoản",
        "khoản",
        "nghị định",
        "thông tư",
        "tài liệu",
        "văn bản",
        "chính sách",
        "nội quy",
        "tiêu chuẩn",
        "iso",
        # action verbs related to document lookup
        "tra cứu",
        "tìm hiểu",
        "giải thích",
        "hướng dẫn cách",
        "làm sao để",
        "cần những gì",
        "yêu cầu gì",
        "phí",
        "lệ phí",
        "bước",
        "hồ sơ",
        "giấy tờ",
    ]

    RAG_PATTERNS: ClassVar[list[re.Pattern[str]]] = [
        re.compile(r"điều\s+\d+", re.IGNORECASE),
        re.compile(r"khoản\s+\d+", re.IGNORECASE),
        re.compile(r"nghị\s+định\s+\d+", re.IGNORECASE),
        re.compile(r"thông\s+tư\s+\d+", re.IGNORECASE),
        re.compile(r"theo\s+quy\s+định", re.IGNORECASE),
    ]

    # ── Public API ──────────────────────────────────────────────────────

    def classify(self, query: str) -> IntentResult:
        """Classify *query* into an :class:`IntentType`.

        Returns an :class:`IntentResult` with confidence and matched signals.
        """
        if not query or not query.strip():
            return IntentResult(
                intent=IntentType.CHAT,
                confidence=1.0,
                signals=[],
            )

        normalized = self._normalize(query)

        # Collect SQL signals (strong + patterns first, then weak)
        sql_strong = self._collect_signals(
            normalized, self.SQL_STRONG_KEYWORDS, self.SQL_PATTERNS
        )
        sql_weak = self._collect_signals(
            normalized, self.SQL_WEAK_KEYWORDS, []
        )

        # Weak SQL signals only count when there is at least one strong signal
        has_strong_sql = len(sql_strong) > 0
        sql_signals = sql_strong + (sql_weak if has_strong_sql else [])

        rag_signals = self._collect_signals(
            normalized, self.RAG_KEYWORDS, self.RAG_PATTERNS
        )

        sql_count = len(sql_signals)
        rag_count = len(rag_signals)

        # No signals at all → default chat
        if sql_count == 0 and rag_count == 0:
            return IntentResult(
                intent=IntentType.CHAT,
                confidence=1.0,
                signals=[],
            )

        # Pick dominant intent; ties go to SQL (data queries are more specific)
        if sql_count >= rag_count:
            return IntentResult(
                intent=IntentType.SQL,
                confidence=self._score(sql_count),
                signals=sql_signals,
            )
        else:
            return IntentResult(
                intent=IntentType.RAG,
                confidence=self._score(rag_count),
                signals=rag_signals,
            )

    # ── Internals ───────────────────────────────────────────────────────

    @staticmethod
    def _normalize(text: str) -> str:
        """Lower-case and collapse whitespace for matching."""
        return " ".join(text.lower().split())

    @staticmethod
    def _collect_signals(
        text: str,
        keywords: list[str],
        patterns: list[re.Pattern[str]],
    ) -> list[str]:
        """Return de-duplicated list of matched keyword strings and pattern labels."""
        matched: list[str] = []
        seen: set[str] = set()

        for kw in keywords:
            if kw.lower() in text and kw.lower() not in seen:
                matched.append(kw)
                seen.add(kw.lower())

        for pat in patterns:
            m = pat.search(text)
            if m:
                label = f"pattern:{m.group()}"
                if label not in seen:
                    matched.append(label)
                    seen.add(label)

        return matched

    @staticmethod
    def _score(signal_count: int) -> float:
        """Map signal count to a confidence value in [0.0, 1.0]."""
        if signal_count <= 0:
            return 0.0
        if signal_count == 1:
            return 0.6
        if signal_count == 2:
            return 0.75
        if signal_count == 3:
            return 0.85
        return min(0.90 + (signal_count - 4) * 0.02, 0.99)
