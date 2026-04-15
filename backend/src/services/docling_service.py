"""Backward-compatible re-export for docling processing.

All logic has been moved to the ``src.services.docling`` package.
This shim exists so that ``from src.services.docling_service import X``
continues to work without changes to callers.
"""
from __future__ import annotations

from src.services.docling.chunker import DocumentChunker
from src.services.docling.models import ChunkData, ProcessingResult, TableData
from src.services.docling.orchestrator import get_processor, process_document_deep
from src.services.docling.parser import DocumentParser
from src.services.docling.table_detector import AdaptiveTableSerializer

__all__ = [
    "AdaptiveTableSerializer",
    "ChunkData",
    "DocumentChunker",
    "DocumentParser",
    "ProcessingResult",
    "TableData",
    "get_processor",
    "process_document_deep",
]
