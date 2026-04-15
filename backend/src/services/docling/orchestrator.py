"""Orchestrator — ties together parsing, chunking, and table detection.

Provides the slimmed-down ``DoclingProcessor`` class, plus the public
convenience functions ``get_processor()`` and ``process_document_deep()``.
"""
from __future__ import annotations

import base64
import logging
import os
from io import BytesIO
from typing import Any

from .chunker import DocumentChunker
from .models import ChunkData, ProcessingResult, TableData
from .parser import (
    DocumentParser,
    env_bool,
    env_int,
    should_call_vlm,
)

logger = logging.getLogger(__name__)


class DoclingProcessor:
    """Deep document processor using Docling's DocumentConverter.

    Best for: PDFs with tables, complex layouts, scanned documents.
    """

    def __init__(self) -> None:
        self._parser = DocumentParser()
        self._chunker = DocumentChunker()

    def process(self, file_path: str) -> ProcessingResult:
        """Process a document through Docling's deep pipeline.

        Returns structured Markdown + extracted tables with page info.

        Parameters
        ----------
        file_path : str
            Absolute path to the document file (PDF recommended).

        Returns
        -------
        ProcessingResult
            Contains ``markdown``, ``tables``, ``chunks``, ``metadata``,
            ``page_count``, and ``source_file``.  On failure the result
            still has valid structure but ``markdown`` is empty and
            ``metadata`` contains an ``error`` key.
        """
        filename = os.path.basename(file_path)
        logger.info(f"[docling] Deep processing: {filename}")

        try:
            converter = self._parser.get_converter()
            result = converter.convert(file_path)
            doc = result.document
            docling_chunks = self._chunker.build_chunks(
                doc, filename
            )

            # ── Export full document as Markdown with page markers ─────
            markdown = ""
            current_page = 0
            from docling.datamodel.document import TextItem, TableItem

            for item, _level in doc.iterate_items():
                prov_page = None
                if hasattr(item, "prov") and item.prov:
                    prov = (
                        item.prov[0]
                        if isinstance(item.prov, list)
                        else item.prov
                    )
                    prov_page = getattr(prov, "page_no", 0) or getattr(
                        prov, "page", 0
                    )

                if prov_page and prov_page != current_page:
                    markdown += (
                        f"\n\n<!-- Page {prov_page} -->\n\n"
                    )
                    current_page = prov_page

                if isinstance(item, TextItem):
                    markdown += item.text + "\n"
                elif isinstance(item, TableItem):
                    markdown += (
                        item.export_to_markdown(doc=doc) + "\n"
                    )

            # ── Smart VLM for Pictures ────────────────────────────────
            api_key = os.getenv("OPENAI_API_KEY")
            base_url = os.getenv(
                "OPENAI_BASE_URL", "https://ezaiapi.com"
            ).rstrip("/")
            model = os.getenv(
                "LLM_MODEL_LIGHT", "gpt-5.3-codex"
            )
            vlm_enabled = env_bool("DOCLING_VLM_ENABLED", True)
            vlm_min_size = env_int("DOCLING_VLM_MIN_SIZE", 300)
            vlm_max_images = env_int("DOCLING_VLM_MAX_IMAGES", 10)
            vlm_prompt = os.getenv(
                "DOCLING_VLM_PROMPT",
                "Mô tả chi tiết nội dung hình ảnh này "
                "(biểu đồ, sơ đồ, bảng scan). "
                "Nếu là biểu đồ: đọc trục, giá trị, xu hướng. "
                "Nếu là sơ đồ quy trình: liệt kê các bước và "
                "kết nối. "
                "Bỏ qua nếu chỉ là logo hoặc ảnh trang trí. "
                "Trả lời bằng tiếng Việt.",
            )

            if vlm_enabled and api_key and doc.pictures:
                logger.info(
                    f"[vlm] Tìm thấy {len(doc.pictures)} ảnh "
                    f"— áp dụng smart filter "
                    f"(min_size={vlm_min_size}px, "
                    f"max_images={vlm_max_images})"
                )
                image_texts: list[tuple[str, int]] = []
                vlm_called = 0
                vlm_skipped = 0

                for pic_ix, pic in enumerate(doc.pictures):
                    if vlm_called >= vlm_max_images:
                        logger.info(
                            f"[vlm] Đã đạt giới hạn "
                            f"{vlm_max_images} ảnh, dừng gọi VLM."
                        )
                        break

                    should_call, reason = should_call_vlm(
                        pic, doc, vlm_min_size
                    )
                    if not should_call:
                        vlm_skipped += 1
                        logger.debug(
                            f"[vlm] skip pic[{pic_ix}]: {reason}"
                        )
                        continue

                    try:
                        pil_img = pic.get_image(doc)
                        buffered = BytesIO()
                        pil_img.save(buffered, format="PNG")
                        img_str = base64.b64encode(
                            buffered.getvalue()
                        ).decode("utf-8")

                        payload = {
                            "model": model,
                            "messages": [
                                {
                                    "role": "user",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": vlm_prompt,
                                        },
                                        {
                                            "type": "image_url",
                                            "image_url": {
                                                "url": (
                                                    "data:image/png;"
                                                    "base64,"
                                                    f"{img_str}"
                                                ),
                                                "detail": "high",
                                            },
                                        },
                                    ],
                                }
                            ],
                            "max_tokens": 1000,
                        }

                        from src.core.http_client import (
                            get_http_client,
                        )

                        headers = {
                            "Authorization": f"Bearer {api_key}"
                        }
                        resp = get_http_client(timeout=60.0).post(
                            f"{base_url}/chat/completions",
                            json=payload,
                            headers=headers,
                        )
                        resp.raise_for_status()
                        desc = resp.json()["choices"][0]["message"][
                            "content"
                        ]

                        page_no_raw = (
                            getattr(pic.prov[0], "page_no", 0)
                            if pic.prov
                            else 0
                        )
                        try:
                            page_no = (
                                int(page_no_raw)
                                if page_no_raw is not None
                                else 0
                            )
                        except Exception:
                            page_no = 0

                        image_texts.append((desc, page_no))
                        vlm_called += 1
                    except Exception as img_exc:
                        logger.warning(
                            f"[vlm] Lỗi khi xử lý ảnh "
                            f"[{pic_ix}]: {img_exc}"
                        )

                logger.info(
                    f"[vlm] Kết quả: gọi={vlm_called}, "
                    f"bỏ qua={vlm_skipped}/{len(doc.pictures)}"
                )

                if image_texts:
                    rendered = []
                    for desc, page_no in image_texts:
                        rendered.append(
                            f"\n\n--- 🖼️ [VLM] Mô tả hình ảnh "
                            f"tại Trang {page_no or '?'} ---\n"
                            f"{desc}\n---"
                        )
                        docling_chunks.append(
                            ChunkData(
                                text=(
                                    f"[Mô tả hình ảnh trang "
                                    f"{page_no or '?'}]\n{desc}"
                                ),
                                page_number=page_no,
                                headings=["Hình ảnh"],
                                metadata={
                                    "kind": "image_description",
                                    "vlm_filtered": True,
                                },
                            )
                        )
                    markdown += "\n" + "".join(rendered)

            # ── Extract tables ────────────────────────────────────────
            tables: list[TableData] = []
            for _table_ix, table in enumerate(doc.tables):
                table_md = (
                    table.export_to_markdown(doc=doc)
                    if hasattr(table, "export_to_markdown")
                    else ""
                )

                page_num = 0
                if hasattr(table, "prov") and table.prov:
                    prov = (
                        table.prov[0]
                        if isinstance(table.prov, list)
                        else table.prov
                    )
                    page_num = getattr(
                        prov, "page_no", 0
                    ) or getattr(prov, "page", 0)

                md_rows = (
                    table_md.count("\n") if table_md else 0
                )
                md_cols = (
                    table_md.split("\n")[0].count("|") - 1
                    if table_md and "|" in table_md
                    else 0
                )

                tables.append(
                    TableData(
                        page_number=page_num,
                        markdown=table_md,
                        rows=md_rows,
                        cols=max(md_cols, 0),
                    )
                )

            # ── Page count ────────────────────────────────────────────
            page_count = 0
            if hasattr(doc, "pages"):
                page_count = (
                    len(doc.pages) if doc.pages else 0
                )
            elif markdown:
                page_count = markdown.count("\f") + 1

            logger.info(
                f"[docling] Done: {filename} — "
                f"{len(markdown)} chars, {len(tables)} tables, "
                f"{page_count} pages"
            )

            return ProcessingResult(
                markdown=markdown,
                tables=tables,
                chunks=docling_chunks,
                metadata={
                    "extractor": "docling",
                    "table_count": len(tables),
                    "page_count": page_count,
                    "docling_chunk_count": len(docling_chunks),
                    "docling_chunking_mode": (
                        "hybrid_adaptive_table_serializer"
                    ),
                },
                page_count=page_count,
                source_file=filename,
            )

        except Exception as e:
            logger.exception(
                f"[docling] Failed to process {filename}: {e}"
            )
            return ProcessingResult(
                markdown="",
                tables=[],
                metadata={
                    "extractor": "docling",
                    "error": str(e),
                },
                page_count=0,
                source_file=filename,
            )


# ---------------------------------------------------------------------------
# Module-level singleton (lazy initialised)
# ---------------------------------------------------------------------------
_processor: DoclingProcessor | None = None


def get_processor() -> DoclingProcessor:
    """Return the module-level ``DoclingProcessor`` singleton.

    Returns
    -------
    DoclingProcessor
        Lazily created singleton instance.
    """
    global _processor
    if _processor is None:
        _processor = DoclingProcessor()
    return _processor


def process_document_deep(file_path: str) -> ProcessingResult:
    """Convenience function for use in Celery tasks.

    Parameters
    ----------
    file_path : str
        Absolute path to the document.

    Returns
    -------
    ProcessingResult
        Result from :meth:`DoclingProcessor.process`.
    """
    return get_processor().process(file_path)
