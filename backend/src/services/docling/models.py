"""Data models for Docling document processing.

Defines the core dataclasses used throughout the docling package:
  - TableData: a single extracted table
  - ChunkData: a single chunk for embedding
  - ProcessingResult: the full result of a deep processing run
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class TableData:
    """A single extracted table."""

    page_number: int = 0
    markdown: str = ""
    rows: int = 0
    cols: int = 0


@dataclass
class ChunkData:
    """A single Docling-native chunk for embedding."""

    text: str = ""
    page_number: int = 0
    headings: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class ProcessingResult:
    """Result returned by the deep processor."""

    markdown: str = ""
    tables: list[TableData] = field(default_factory=list)
    chunks: list[ChunkData] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)
    page_count: int = 0
    source_file: str = ""
