"""
Docling Service — Deep Path document processing.

Handles complex PDFs with tables, charts, and intricate layouts.
Uses Docling's DocumentConverter to produce clean Markdown with
structural understanding (tables, headings, page numbers).
"""
from __future__ import annotations

import logging
import os
import re
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger(__name__)


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


class DoclingProcessor:
    """
    Deep document processor using Docling's DocumentConverter.
    Best for: PDFs with tables, complex layouts, scanned documents.
    """

    def __init__(self):
        self._converter = None

    @staticmethod
    def _env_int(name: str, default: int, minimum: int = 1) -> int:
        raw = os.getenv(name, str(default)).strip()
        try:
            value = int(raw)
        except ValueError:
            return default
        return max(value, minimum)

    @staticmethod
    def _env_bool(name: str, default: bool) -> bool:
        raw = os.getenv(name)
        if raw is None:
            return default
        return raw.strip().lower() in {"1", "true", "yes", "on"}

    @staticmethod
    def _slugify_key(text: str) -> str:
        clean = re.sub(r"\s+", " ", (text or "").strip().lower())
        clean = re.sub(r"[^\w\- ]+", "", clean)
        clean = clean.replace(" ", "_")
        return clean or "unknown"

    @staticmethod
    def _normalize_money_and_unit(value: str) -> str:
        """
        Normalize fee/currency/unit expressions to stable tokens.
        Works across documents and does not assume one domain.
        """
        text = re.sub(r"\s+", " ", (value or "").strip())
        if not text:
            return ""

        lower = text.lower()
        currency_code = ""
        currency_patterns = [
            (r"(?:\bvnd\b|vnđ|₫|\bdong\b|(?<=\d)\s*đ\b)", "VND"),
            (r"(?:\busd\b|\$)", "USD"),
            (r"(?:\beur\b|€)", "EUR"),
            (r"(?:\bgbp\b|£)", "GBP"),
            (r"(?:\bjpy\b|¥)", "JPY"),
            (r"(?:\binr\b|₹)", "INR"),
        ]
        for pattern, code in currency_patterns:
            if re.search(pattern, lower):
                currency_code = code
                break

        unit_patterns = [
            (r"(?:/\s*cont(?:ainer)?\b|\bper\s+container\b)", "container"),
            (r"(?:/\s*teu\b|\bteu\b)", "teu"),
            (r"(?:/\s*day\b|/\s*ng[aà]y\b|\bper\s+day\b)", "day"),
            (r"(?:/\s*month\b|/\s*th[aá]ng\b|\bper\s+month\b)", "month"),
            (r"(?:/\s*year\b|/\s*n[aă]m\b|\bper\s+year\b)", "year"),
            (r"(?:/\s*hour\b|/\s*gi[oờ]\b|\bper\s+hour\b)", "hour"),
            (r"(?:/\s*trip\b|/\s*l[uượ]t\b|\bper\s+trip\b)", "trip"),
            (r"(?:/\s*item\b|/\s*unit\b|\bper\s+item\b)", "item"),
        ]
        unit_tokens: list[str] = []
        for pattern, token in unit_patterns:
            if re.search(pattern, lower):
                unit_tokens.append(token)
        unit_tokens = list(dict.fromkeys(unit_tokens))

        if not currency_code and not unit_tokens:
            return ""

        num_match = re.search(r"-?\d[\d\.,\s]*", text)
        amount: int | None = None
        if num_match:
            digits = re.sub(r"[^\d]", "", num_match.group(0))
            if digits:
                try:
                    amount = int(digits)
                except ValueError:
                    amount = None

        unit_suffix = "".join(f"/{token}" for token in unit_tokens)
        if amount is None:
            if currency_code:
                return f"{currency_code}{unit_suffix}"
            return unit_suffix.lstrip("/")

        prefix = f"{amount} {currency_code}".strip()
        return f"{prefix}{unit_suffix}"

    @staticmethod
    def _normalize_group_hints(raw: str | None) -> list[str]:
        base = (
            raw
            if raw is not None
            else "type,category,item,service,description,name,code,id,loai,muc,dich vu"
        )
        return [hint.strip().lower() for hint in base.split(",") if hint.strip()]

    @staticmethod
    def _looks_like_identifier(text: str) -> bool:
        val = (text or "").strip()
        if not val:
            return False
        alnum_len = len(re.sub(r"[^A-Za-z0-9]", "", val))
        alnum_ratio = alnum_len / max(len(val), 1)
        return bool(re.search(r"[A-Za-z]", val)) and alnum_ratio >= 0.55

    @staticmethod
    def _extract_row_keys(text: str) -> list[str]:
        keys = re.findall(r"row_key=([^\]\s]+)", text or "")
        deduped: list[str] = []
        seen: set[str] = set()
        for key in keys:
            if key and key not in seen:
                seen.add(key)
                deduped.append(key)
        return deduped

    def _build_embedding_prefix(self, headings: list[str], row_keys: list[str]) -> str:
        prefix_parts: list[str] = []
        clean_headings = [h.strip() for h in headings if h and h.strip()]
        if clean_headings:
            prefix_parts.append(f"heading: {' > '.join(clean_headings[-3:])}")
        if row_keys:
            prefix_parts.append(f"row_key: {', '.join(row_keys[:3])}")
        return " | ".join(prefix_parts)

    def _apply_group_lock(
        self,
        chunks: list[ChunkData],
        *,
        max_chars: int,
    ) -> list[ChunkData]:
        """Merge adjacent chunks that share table row keys to avoid split-row retrieval.

        Uses a conservative token estimate (chars / 3) to stay within the embedding
        model's token budget (default 512 tokens). Vietnamese text averages ~3-4 chars
        per token, so dividing by 3 gives a safe upper-bound estimate.
        """
        if len(chunks) < 2:
            return chunks

        # Derive a safe max_chars from token budget: assume ~3 chars/token (conservative)
        # This prevents merged chunks from silently exceeding the embedding model's max_tokens.
        max_tokens = int(os.getenv("DOCLING_CHUNK_MAX_TOKENS", "2048"))
        token_safe_max_chars = max_tokens * 3  # ~3 chars/token (conservative for Vietnamese)
        effective_max_chars = min(max_chars, token_safe_max_chars)

        merged: list[ChunkData] = []
        current = chunks[0]

        for nxt in chunks[1:]:
            current_meta = current.metadata if isinstance(current.metadata, dict) else {}
            next_meta = nxt.metadata if isinstance(nxt.metadata, dict) else {}
            current_keys = current_meta.get("row_keys") or []
            next_keys = next_meta.get("row_keys") or []

            shared_keys = set(current_keys).intersection(next_keys)
            can_merge = (
                bool(shared_keys)
                and current.page_number == nxt.page_number
                and len(current.text) + len(nxt.text) + 1 <= effective_max_chars
            )

            if can_merge:
                current.text = f"{current.text}\n{nxt.text}"
                current_keys_merged = list(dict.fromkeys([*current_keys, *next_keys]))
                current_meta["row_keys"] = current_keys_merged
                current.metadata = current_meta
            else:
                merged.append(current)
                current = nxt

        merged.append(current)
        return merged

    @staticmethod
    def _table_page_no(item: Any) -> int:
        if hasattr(item, "prov") and item.prov:
            prov = item.prov[0] if isinstance(item.prov, list) else item.prov
            page_raw = getattr(prov, "page_no", 0) or getattr(prov, "page", 0)
            try:
                page_no = int(page_raw) if page_raw is not None else 0
                return max(page_no, 0)
            except Exception:
                return 0
        return 0

    @staticmethod
    def _should_call_vlm(pic: Any, doc: Any, min_size: int = 300) -> tuple[bool, str]:
        """
        Smart filter: quyết định có nên gọi VLM cho ảnh này không.

        Skip conditions (theo thứ tự, short-circuit):
          1. Không load được ảnh
          2. Ảnh nhỏ hơn min_size×min_size px (logo, icon, trang trí)
          3. Docling đã có caption/OCR text tại vị trí ảnh

        Returns: (should_call: bool, reason: str)
        """
        # 1. Load & size check
        try:
            pil_img = pic.get_image(doc)
            if not pil_img:
                return False, "no_image"
            w, h = pil_img.size
            if w < min_size or h < min_size:
                return False, f"too_small_{w}x{h}"
        except Exception as exc:
            return False, f"image_load_error: {exc}"

        # 2. Skip nếu Docling đã đọc được text từ ảnh (OCR caption)
        try:
            captions = getattr(pic, "captions", None) or []
            if captions:
                # Có ít nhất 1 caption → Docling đã đọc được nội dung
                return False, "has_ocr_caption"
        except Exception:
            pass

        try:
            inline_text = getattr(pic, "text", None) or ""
            if inline_text.strip():
                return False, "has_inline_text"
        except Exception:
            pass

        return True, ""

    @staticmethod
    def _resolve_group_col_index(cols: list[str], hints: list[str]) -> int:
        lowered = [c.lower() for c in cols]
        for idx, col_name in enumerate(lowered):
            if any(hint in col_name for hint in hints):
                return idx
        return 0

    def _pick_group_key_col(self, cols: list[str], table_df, hints: list[str]) -> int:
        hinted_idx = self._resolve_group_col_index(cols, hints)
        if hinted_idx > 0:
            return hinted_idx

        # Fallback for unknown schemas: pick first identifier-like column.
        nrows = getattr(table_df, "shape", [0, 0])[0]
        max_cols = max(len(cols), 1)
        for j in range(max_cols):
            sample = ""
            for i in range(1, min(nrows, 6)):
                try:
                    sample = str(table_df.iloc[i, j]).strip()
                except Exception:
                    sample = ""
                if sample:
                    break
            if self._looks_like_identifier(sample):
                return j

        return 0

    @staticmethod
    def _extract_page_from_chunk_meta(dl_meta: dict[str, Any]) -> int:
        """Extract page number from Docling chunk metadata."""
        doc_items = dl_meta.get("doc_items") if isinstance(dl_meta, dict) else None
        if isinstance(doc_items, list):
            for item in doc_items:
                if not isinstance(item, dict):
                    continue
                prov_list = item.get("prov") or []
                if not isinstance(prov_list, list):
                    continue
                for prov in prov_list:
                    if not isinstance(prov, dict):
                        continue
                    raw_page = prov.get("page_no") or prov.get("page")
                    if raw_page is None:
                        continue
                    try:
                        return int(raw_page)
                    except Exception:
                        continue
        return 0

    def _build_docling_chunks(self, doc, source_file: str) -> list[ChunkData]:
        """
        Build chunk list using Docling HybridChunker + adaptive table serializer.
        Falls back to empty list if optional dependencies/tokenizer are unavailable.
        """
        try:
            from docling.chunking import HybridChunker
            from docling_core.transforms.chunker.hierarchical_chunker import (
                ChunkingDocSerializer,
                ChunkingSerializerProvider,
            )
            from docling_core.transforms.serializer.base import (
                BaseDocSerializer,
                BaseTableSerializer,
                SerializationResult,
            )
            from docling_core.transforms.serializer.common import create_ser_result
            from docling_core.transforms.chunker.tokenizer.huggingface import HuggingFaceTokenizer
            from docling_core.transforms.serializer.markdown import MarkdownParams
            from docling_core.types.doc.document import TableItem
            from transformers import AutoTokenizer
        except Exception as exc:
            logger.warning(f"[docling] Hybrid chunking imports unavailable: {exc}")
            return []

        markdown_max_cols = self._env_int("DOCLING_TABLE_MARKDOWN_MAX_COLS", 4)
        markdown_max_cells = self._env_int("DOCLING_TABLE_MARKDOWN_MAX_CELLS", 36)
        group_key_hints = self._normalize_group_hints(os.getenv("DOCLING_TABLE_GROUP_KEY_HINTS"))
        keep_heading_prefix = self._env_bool("DOCLING_PREFIX_HEADING_ROWKEY", True)
        enable_group_lock = self._env_bool("DOCLING_GROUP_LOCK_ENABLED", True)
        group_lock_max_chars = self._env_int("DOCLING_GROUP_LOCK_MAX_CHARS", 1800, minimum=256)
        normalize_table_values = self._env_bool("DOCLING_TABLE_NORMALIZE_VALUES", True)

        normalize_money_and_unit = self._normalize_money_and_unit
        slugify_key = self._slugify_key
        table_page_no = self._table_page_no
        pick_group_key_col = self._pick_group_key_col

        class AdaptiveTableSerializer(BaseTableSerializer):
            """Hybrid serializer for arbitrary tables with optional value normalization."""

            def serialize(
                self,
                *,
                item: TableItem,
                doc_serializer: BaseDocSerializer,
                doc,
                **kwargs,
            ) -> SerializationResult:
                parts: list[SerializationResult] = []

                cap_res = doc_serializer.serialize_captions(item=item, **kwargs)
                if cap_res.text:
                    parts.append(cap_res)

                if item.self_ref in doc_serializer.get_excluded_refs(**kwargs):
                    text_res = "\n\n".join([r.text for r in parts])
                    return create_ser_result(text=text_res, span_source=parts)

                table_df = item.export_to_dataframe(doc=doc)
                if table_df.shape[0] < 1 or table_df.shape[1] < 2:
                    text_res = "\n\n".join([r.text for r in parts])
                    return create_ser_result(text=text_res, span_source=parts)

                # Align with default triplet serializer:
                # prepend headers as first row, then iterate data rows/cols from index 1.
                table_df.loc[-1] = table_df.columns  # type: ignore[call-overload]
                table_df.index = table_df.index + 1
                table_df = table_df.sort_index()

                rows = [str(v).strip() for v in table_df.iloc[:, 0].to_list()]
                cols = [str(v).strip() for v in table_df.iloc[0, :].to_list()]
                nrows, ncols = table_df.shape
                data_cells = max(0, nrows - 1) * max(0, ncols - 1)
                page_no = table_page_no(item)

                group_col_idx = pick_group_key_col(cols, table_df, group_key_hints)
                if group_col_idx < 0 or group_col_idx >= ncols:
                    group_col_idx = 0

                is_small_table = ncols <= markdown_max_cols and data_cells <= markdown_max_cells
                table_text_parts: list[str] = []

                for i in range(1, nrows):
                    group_value = str(table_df.iloc[i, group_col_idx]).strip()
                    if not group_value:
                        group_value = rows[i] if i < len(rows) else f"row_{i}"
                    row_key = slugify_key(group_value)

                    for j in range(1, ncols):
                        col_key_raw = cols[j] if j < len(cols) else f"col_{j}"
                        col_key = slugify_key(col_key_raw)
                        cell_value_raw = str(table_df.iloc[i, j]).strip()
                        normalized = (
                            normalize_money_and_unit(cell_value_raw)
                            if normalize_table_values
                            else ""
                        )

                        base_text = f"{group_value}, {col_key_raw} = {cell_value_raw}"
                        if normalized:
                            base_text += f" (norm: {normalized})"

                        table_text_parts.append(
                            "[tbl_cell "
                            f"page={page_no or 1} "
                            f"row={i} "
                            f"col={j} "
                            f"row_key={row_key} "
                            f"col_key={col_key}"
                            f"] {base_text}"
                        )

                if is_small_table:
                    table_markdown = item.export_to_markdown(doc=doc)
                    if table_text_parts:
                        table_text = f"{table_markdown}\n\n" + "\n".join(table_text_parts)
                    else:
                        table_text = table_markdown
                else:
                    meta_line = (
                        "[tbl_meta "
                        f"page={page_no or 1} "
                        f"rows={max(0, nrows - 1)} "
                        f"cols={max(0, ncols - 1)} "
                        "mode=triplet]"
                    )
                    table_text = meta_line
                    if table_text_parts:
                        table_text += "\n" + ". ".join(table_text_parts)

                parts.append(create_ser_result(text=table_text, span_source=item))
                text_res = "\n\n".join([r.text for r in parts])
                return create_ser_result(text=text_res, span_source=parts)

        class TripletSerializerProvider(ChunkingSerializerProvider):
            # Docling may call with positional doc or keyword `doc=...` depending on version.
            def get_serializer(self, doc=None, **kwargs):  # noqa: ANN001
                local_doc = doc if doc is not None else kwargs.get("doc")
                if local_doc is None:
                    raise ValueError("Docling serializer provider received no document instance")
                return ChunkingDocSerializer(
                    doc=local_doc,
                    table_serializer=AdaptiveTableSerializer(),
                    params=MarkdownParams(image_placeholder="<!-- image -->"),
                )

        max_tokens_raw = os.getenv("DOCLING_CHUNK_MAX_TOKENS", "2048")
        merge_peers_raw = os.getenv("DOCLING_CHUNK_MERGE_PEERS", "true")
        preferred_model = os.getenv("DOCLING_TOKENIZER_MODEL")
        embed_model = os.getenv("EMBEDDING_MODEL")
        model_candidates = [
            preferred_model,
            embed_model,
            "sentence-transformers/all-MiniLM-L6-v2",
        ]

        try:
            max_tokens = max(128, int(max_tokens_raw))
        except ValueError:
            max_tokens = 512

        merge_peers = merge_peers_raw.strip().lower() in {"1", "true", "yes", "on"}

        tokenizer = None
        tried_models: set[str] = set()
        for model_id in model_candidates:
            if not model_id or model_id in tried_models:
                continue
            tried_models.add(model_id)
            try:
                hf_tok = AutoTokenizer.from_pretrained(model_id)
                tokenizer = HuggingFaceTokenizer(tokenizer=hf_tok, max_tokens=max_tokens)
                logger.info(f"[docling] Using tokenizer model: {model_id}")
                break
            except Exception as exc:
                logger.warning(f"[docling] Failed loading tokenizer '{model_id}': {exc}")

        if tokenizer is None:
            logger.warning("[docling] Could not initialize tokenizer for HybridChunker.")
            return []

        try:
            chunker = HybridChunker(
                tokenizer=tokenizer,
                serializer_provider=TripletSerializerProvider(),
                merge_peers=merge_peers,
            )
            raw_chunks = list(chunker.chunk(dl_doc=doc))
        except Exception as exc:
            logger.warning(f"[docling] Failed to create chunks via HybridChunker: {exc}")
            return []

        chunks: list[ChunkData] = []
        for chunk in raw_chunks:
            try:
                text = chunker.contextualize(chunk).strip()
            except Exception:
                text = ""
            if not text:
                continue

            dl_meta: dict[str, Any] = {}
            try:
                dl_meta = chunk.meta.model_dump() if chunk.meta is not None else {}
            except Exception:
                dl_meta = {}

            headings = dl_meta.get("headings") if isinstance(dl_meta, dict) else None
            if isinstance(headings, list):
                heading_list = [str(h).strip() for h in headings if str(h).strip()]
            elif headings:
                heading_list = [str(headings).strip()]
            else:
                heading_list = []

            row_keys = self._extract_row_keys(text)
            if row_keys:
                dl_meta["row_keys"] = row_keys
                dl_meta["has_cell_provenance"] = True

            if keep_heading_prefix:
                prefix = self._build_embedding_prefix(heading_list, row_keys)
                if prefix:
                    text = f"[chunk_context {prefix}]\n{text}"

            page_number = self._extract_page_from_chunk_meta(dl_meta)
            chunks.append(
                ChunkData(
                    text=text,
                    page_number=page_number,
                    headings=heading_list,
                    metadata=dl_meta,
                )
            )

        if enable_group_lock:
            chunks = self._apply_group_lock(chunks, max_chars=group_lock_max_chars)

        logger.info(
            f"[docling] Hybrid chunking generated {len(chunks)} chunks for {source_file}"
        )
        return chunks

    def _get_converter(self):
        """Lazy-load the DocumentConverter with OCR/VLM capabilities enabled."""
        if self._converter is None:
            logger.info("[docling] Initializing DocumentConverter (this may take a moment)...")
            try:
                from docling.document_converter import DocumentConverter, PdfFormatOption
                from docling.datamodel.pipeline_options import PdfPipelineOptions
                from docling.datamodel.base_models import InputFormat

                # Configure pipeline options to enable image processing / OCR (PDF only)
                pdf_pipeline_options = PdfPipelineOptions()
                pdf_pipeline_options.generate_page_images = True # Required for image processing
                pdf_pipeline_options.images_scale = 2.0
                pdf_pipeline_options.generate_picture_images = True

                # Apply configuration to PDF formats only (Docx, Pptx use default safe config)
                self._converter = DocumentConverter(
                    format_options={
                        InputFormat.PDF: PdfFormatOption(pipeline_options=pdf_pipeline_options),
                    }
                )
                logger.info("[docling] DocumentConverter ready with Image Extraction enabled.")
            except ImportError as ie:
                logger.error(f"[docling] docling package not installed properly! Error: {ie}")
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
            docling_chunks = self._build_docling_chunks(doc, filename)

            # Export full document as Markdown with hidden Page Markers
            # markdown = doc.export_to_markdown() -> Default format lacks distinct HTML page markers
            markdown = ""
            current_page = 0
            from docling.datamodel.document import TextItem, TableItem
            
            for item, level in doc.iterate_items():
                prov_page = None
                if hasattr(item, "prov") and item.prov:
                    prov = item.prov[0] if isinstance(item.prov, list) else item.prov
                    prov_page = getattr(prov, "page_no", 0) or getattr(prov, "page", 0)
                    
                if prov_page and prov_page != current_page:
                    markdown += f"\n\n<!-- Page {prov_page} -->\n\n"
                    current_page = prov_page
                    
                if isinstance(item, TextItem):
                    markdown += item.text + "\n"
                elif isinstance(item, TableItem):
                    markdown += item.export_to_markdown(doc=doc) + "\n"

            # ── Smart VLM for Pictures ─────────────────────────────────────
            # Chỉ gọi VLM khi ảnh đủ lớn VÀ Docling chưa đọc được text.
            # Skip logo/icon/trang trí → giảm chi phí API + noise trong Qdrant.
            import base64
            from io import BytesIO

            api_key = os.getenv("OPENAI_API_KEY")
            base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
            model = os.getenv("LLM_MODEL", "gpt-4o-mini")
            vlm_enabled = self._env_bool("DOCLING_VLM_ENABLED", True)
            vlm_min_size = self._env_int("DOCLING_VLM_MIN_SIZE", 300)
            vlm_max_images = self._env_int("DOCLING_VLM_MAX_IMAGES", 10)
            vlm_prompt = os.getenv(
                "DOCLING_VLM_PROMPT",
                "Mô tả chi tiết nội dung hình ảnh này (biểu đồ, sơ đồ, bảng scan). "
                "Nếu là biểu đồ: đọc trục, giá trị, xu hướng. "
                "Nếu là sơ đồ quy trình: liệt kê các bước và kết nối. "
                "Bỏ qua nếu chỉ là logo hoặc ảnh trang trí. "
                "Trả lời bằng tiếng Việt.",
            )

            if vlm_enabled and api_key and doc.pictures:
                logger.info(
                    f"[vlm] Tìm thấy {len(doc.pictures)} ảnh — áp dụng smart filter "
                    f"(min_size={vlm_min_size}px, max_images={vlm_max_images})"
                )
                image_texts: list[tuple[str, int]] = []
                vlm_called = 0
                vlm_skipped = 0

                for pic_ix, pic in enumerate(doc.pictures):
                    if vlm_called >= vlm_max_images:
                        logger.info(f"[vlm] Đã đạt giới hạn {vlm_max_images} ảnh, dừng gọi VLM.")
                        break

                    should_call, reason = self._should_call_vlm(pic, doc, vlm_min_size)
                    if not should_call:
                        vlm_skipped += 1
                        logger.debug(f"[vlm] skip pic[{pic_ix}]: {reason}")
                        continue

                    try:
                        pil_img = pic.get_image(doc)
                        buffered = BytesIO()
                        pil_img.save(buffered, format="PNG")
                        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

                        payload = {
                            "model": model,
                            "messages": [{
                                "role": "user",
                                "content": [
                                    {"type": "text", "text": vlm_prompt},
                                    {"type": "image_url", "image_url": {
                                        "url": f"data:image/png;base64,{img_str}",
                                        "detail": "high",
                                    }},
                                ],
                            }],
                            "max_tokens": 1000,
                        }

                        from src.core.http_client import get_http_client
                        headers = {"Authorization": f"Bearer {api_key}"}
                        resp = get_http_client(timeout=60.0).post(
                            f"{base_url}/chat/completions", json=payload, headers=headers
                        )
                        resp.raise_for_status()
                        desc = resp.json()["choices"][0]["message"]["content"]

                        page_no_raw = getattr(pic.prov[0], "page_no", 0) if pic.prov else 0
                        try:
                            page_no = int(page_no_raw) if page_no_raw is not None else 0
                        except Exception:
                            page_no = 0

                        image_texts.append((desc, page_no))
                        vlm_called += 1
                    except Exception as img_exc:
                        logger.warning(f"[vlm] Lỗi khi xử lý ảnh [{pic_ix}]: {img_exc}")

                logger.info(
                    f"[vlm] Kết quả: gọi={vlm_called}, bỏ qua={vlm_skipped}/{len(doc.pictures)}"
                )

                if image_texts:
                    rendered = []
                    for desc, page_no in image_texts:
                        rendered.append(
                            f"\n\n--- 🖼️ [VLM] Mô tả hình ảnh tại Trang {page_no or '?'} ---\n"
                            f"{desc}\n---"
                        )
                        docling_chunks.append(
                            ChunkData(
                                text=f"[Mô tả hình ảnh trang {page_no or '?'}]\n{desc}",
                                page_number=page_no,
                                headings=["Hình ảnh"],
                                metadata={"kind": "image_description", "vlm_filtered": True},
                            )
                        )
                    markdown += "\n" + "".join(rendered)

            # Extract tables
            tables = []
            for table_ix, table in enumerate(doc.tables):
                table_md = (
                    table.export_to_markdown(doc=doc)
                    if hasattr(table, "export_to_markdown")
                    else ""
                )

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
                chunks=docling_chunks,
                metadata={
                    "extractor": "docling",
                    "table_count": len(tables),
                    "page_count": page_count,
                    "docling_chunk_count": len(docling_chunks),
                    "docling_chunking_mode": "hybrid_adaptive_table_serializer",
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
