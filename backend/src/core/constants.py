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
