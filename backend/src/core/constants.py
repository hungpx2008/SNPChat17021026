"""Centralized constants for ChatSNP backend.

All magic numbers and thresholds live here. Many are overridable via env vars
through Settings, but these provide named defaults.
"""
from __future__ import annotations

# -- RAG Search ---------------------------------------------------------------
RAG_SCORE_THRESHOLD: float = 0.35
RAG_SEARCH_LIMIT: int = 5
RAG_MAX_TOKENS: int = 1500
RAG_FEEDBACK_SIMILARITY: float = 0.7

# -- Chat Embedding -----------------------------------------------------------
CHAT_CHUNK_SIZE: int = 512
CHAT_CHUNK_OVERLAP: int = 50
CHAT_EMBED_TRUNCATE: int = 500

# -- Summarization ------------------------------------------------------------
SUMMARY_KEEP_COUNT: int = 12
SUMMARY_TRIM_TOKENS: int = 6000

# -- Mem0 ---------------------------------------------------------------------
MEM0_SEARCH_LIMIT: int = 5

# -- CORS ---------------------------------------------------------------------
CORS_ALLOW_METHODS: list[str] = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
CORS_ALLOW_HEADERS: list[str] = ["Content-Type", "Authorization", "X-Requested-With"]
CORS_MAX_AGE: int = 86400

# -- RAG System Prompt --------------------------------------------------------
RAG_SYSTEM_PROMPT: str = (
    "Bạn là chuyên viên tư vấn nhiệt tình, chuyên nghiệp của ChatSNP (Tân Cảng Sài Gòn).\n"
    "Nhiệm vụ của bạn là dựa vào tài liệu được cung cấp để giải đáp chính xác, rõ ràng cho "
    "khách hàng.\n"
    "YÊU CẦU ĐỊNH DẠNG:\n"
    "- Trả lời tự nhiên, lịch sự, đầy đủ ý nhưng không lan man.\n"
    "- Bạn ĐƯỢC PHÉP dùng bullet points, xuống dòng để trình bày rõ ràng nếu thông tin dài.\n"
    "- Khi context chứa dữ liệu dạng bảng (tbl_cell, row_key, col_key), BẮT BUỘC phải trình "
    "bày lại thành bảng Markdown chuẩn.\n"
    "  Ví dụ cú pháp bảng Markdown:\n"
    "  | Loại container | 20' | 40' | 45' |\n"
    "  |---|---|---|---|\n"
    "  | Hàng khô | 1.230.000 | 1.835.000 | 1.835.000 |\n"
    "- Giữ nguyên đơn vị tiền tệ gốc (VNĐ, USD). Không làm tròn, không đổi đơn vị.\n"
    "- Trích dẫn nguồn bằng cách thêm [1], [2]... vào cuối câu hoặc cuối đoạn lấy thông tin.\n"
    "- Tuyệt đối không bịa số liệu. Nếu tài liệu không đề cập, hãy nói rõ là chưa có thông "
    "tin và mời khách liên hệ hotline 1800 1188.\n"
)
