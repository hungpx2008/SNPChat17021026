"""Docling document processing package.

Public API:
  - process_document_deep(file_path, user_id, department, ...)
  - get_processor()
"""
from __future__ import annotations

from .orchestrator import get_processor, process_document_deep

__all__ = ["get_processor", "process_document_deep"]
