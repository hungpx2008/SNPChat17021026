"""
Docling Service — Deep Path document processing.

Handles complex PDFs with tables, charts, and intricate layouts.
Uses Docling's DocumentConverter to produce clean Markdown with
structural understanding (tables, headings, page numbers).
"""
from __future__ import annotations

import logging
import os
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


@dataclass
class TableData:
    """A single extracted table."""
    page_number: int = 0
    markdown: str = ""
    rows: int = 0
    cols: int = 0


@dataclass
class ProcessingResult:
    """Result returned by the deep processor."""
    markdown: str = ""
    tables: list[TableData] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)
    page_count: int = 0
    source_file: str = ""


class DoclingProcessor:
    """
    Deep document processor using Docling's DocumentConverter.
    Best for: PDFs with tables, complex layouts, scanned documents.
    """

    def __init__(self):
        self._converter = None

    def _get_converter(self):
        """Lazy-load the DocumentConverter (heavy, ~2GB RAM)."""
        if self._converter is None:
            logger.info("[docling] Initializing DocumentConverter (this may take a moment)...")
            try:
                from docling.document_converter import DocumentConverter
                self._converter = DocumentConverter()
                logger.info("[docling] DocumentConverter ready.")
            except ImportError:
                logger.error("[docling] docling package not installed!")
                raise
        return self._converter

    def process(self, file_path: str) -> ProcessingResult:
        """
        Process a document through Docling's deep pipeline.
        Returns structured Markdown + extracted tables with page info.
        """
        filename = os.path.basename(file_path)
        logger.info(f"[docling] Deep processing: {filename}")

        try:
            converter = self._get_converter()
            result = converter.convert(file_path)
            doc = result.document

            # Export full document as Markdown
            markdown = doc.export_to_markdown()

            # Extract tables
            tables = []
            for table_ix, table in enumerate(doc.tables):
                table_md = table.export_to_markdown() if hasattr(table, "export_to_markdown") else ""

                # Try to get page number from table's provenance
                page_num = 0
                if hasattr(table, "prov") and table.prov:
                    prov = table.prov[0] if isinstance(table.prov, list) else table.prov
                    page_num = getattr(prov, "page_no", 0) or getattr(prov, "page", 0)

                # Count rows/cols
                rows = table_md.count("\n") if table_md else 0
                cols = table_md.split("\n")[0].count("|") - 1 if table_md and "|" in table_md else 0

                tables.append(TableData(
                    page_number=page_num,
                    markdown=table_md,
                    rows=rows,
                    cols=max(cols, 0),
                ))

            # Page count
            page_count = 0
            if hasattr(doc, "pages"):
                page_count = len(doc.pages) if doc.pages else 0
            elif markdown:
                page_count = markdown.count("\f") + 1

            logger.info(
                f"[docling] Done: {filename} — "
                f"{len(markdown)} chars, {len(tables)} tables, {page_count} pages"
            )

            return ProcessingResult(
                markdown=markdown,
                tables=tables,
                metadata={
                    "extractor": "docling",
                    "table_count": len(tables),
                    "page_count": page_count,
                },
                page_count=page_count,
                source_file=filename,
            )

        except Exception as e:
            logger.exception(f"[docling] Failed to process {filename}: {e}")
            return ProcessingResult(
                markdown="",
                tables=[],
                metadata={"extractor": "docling", "error": str(e)},
                page_count=0,
                source_file=filename,
            )


# Module-level singleton (lazy initialized)
_processor: DoclingProcessor | None = None


def get_processor() -> DoclingProcessor:
    global _processor
    if _processor is None:
        _processor = DoclingProcessor()
    return _processor


def process_document_deep(file_path: str) -> ProcessingResult:
    """Convenience function for use in Celery tasks."""
    return get_processor().process(file_path)
