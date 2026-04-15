"""Parsing utilities and static helpers for Docling processing.

Contains environment helpers, text normalisation, slug generation,
table-analysis heuristics, and the ``DocumentParser`` class that
wraps Docling's ``DocumentConverter`` with lazy initialisation.
"""
from __future__ import annotations

import logging
import os
import re
from typing import Any

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Environment helpers
# ---------------------------------------------------------------------------

def env_int(name: str, default: int, minimum: int = 1) -> int:
    """Read an integer from the environment with a lower bound."""
    raw = os.getenv(name, str(default)).strip()
    try:
        value = int(raw)
    except ValueError:
        return default
    return max(value, minimum)


def env_bool(name: str, default: bool) -> bool:
    """Read a boolean from the environment (accepts 1/true/yes/on)."""
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


# ---------------------------------------------------------------------------
# Text / slug helpers
# ---------------------------------------------------------------------------

def slugify_key(text: str) -> str:
    """Turn arbitrary text into a lowercase slug suitable for metadata keys."""
    clean = re.sub(r"\s+", " ", (text or "").strip().lower())
    clean = re.sub(r"[^\w\- ]+", "", clean)
    clean = clean.replace(" ", "_")
    return clean or "unknown"


def normalize_money_and_unit(value: str) -> str:
    """Normalize fee/currency/unit expressions to stable tokens.

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


def normalize_group_hints(raw: str | None) -> list[str]:
    """Parse comma-separated group-key hint names from a raw config string."""
    base = (
        raw
        if raw is not None
        else "type,category,item,service,description,name,code,id,loai,muc,dich vu"
    )
    return [hint.strip().lower() for hint in base.split(",") if hint.strip()]


def looks_like_identifier(text: str) -> bool:
    """Heuristic: does *text* look like an alphanumeric identifier?"""
    val = (text or "").strip()
    if not val:
        return False
    alnum_len = len(re.sub(r"[^A-Za-z0-9]", "", val))
    alnum_ratio = alnum_len / max(len(val), 1)
    return bool(re.search(r"[A-Za-z]", val)) and alnum_ratio >= 0.55


def extract_row_keys(text: str) -> list[str]:
    """Extract deduplicated ``row_key=…`` values from chunk text."""
    keys = re.findall(r"row_key=([^\]\s]+)", text or "")
    deduped: list[str] = []
    seen: set[str] = set()
    for key in keys:
        if key and key not in seen:
            seen.add(key)
            deduped.append(key)
    return deduped


# ---------------------------------------------------------------------------
# Table helpers
# ---------------------------------------------------------------------------

def table_page_no(item: Any) -> int:
    """Return the page number for a Docling table/picture item."""
    if hasattr(item, "prov") and item.prov:
        prov = item.prov[0] if isinstance(item.prov, list) else item.prov
        page_raw = getattr(prov, "page_no", 0) or getattr(prov, "page", 0)
        try:
            page_no = int(page_raw) if page_raw is not None else 0
            return max(page_no, 0)
        except Exception:
            return 0
    return 0


def should_call_vlm(
    pic: Any, doc: Any, min_size: int = 300
) -> tuple[bool, str]:
    """Smart filter: decide whether to call VLM for this picture.

    Skip conditions (short-circuit order):
      1. Cannot load image
      2. Image smaller than *min_size* x *min_size* px (logo, icon, decoration)
      3. Docling already has caption / OCR text at the image position

    Returns ``(should_call, reason)``.
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

    # 2. Skip if Docling already read text from image (OCR caption)
    try:
        captions = getattr(pic, "captions", None) or []
        if captions:
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


def resolve_group_col_index(cols: list[str], hints: list[str]) -> int:
    """Return the column index whose header matches one of the *hints*."""
    lowered = [c.lower() for c in cols]
    for idx, col_name in enumerate(lowered):
        if any(hint in col_name for hint in hints):
            return idx
    return 0


def pick_group_key_col(
    cols: list[str], table_df: Any, hints: list[str]
) -> int:
    """Choose the best group-key column for a table.

    Tries hint-based matching first, then falls back to the first
    identifier-like column.
    """
    hinted_idx = resolve_group_col_index(cols, hints)
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
        if looks_like_identifier(sample):
            return j

    return 0


def extract_page_from_chunk_meta(dl_meta: dict[str, Any]) -> int:
    """Extract page number from Docling chunk metadata."""
    doc_items = (
        dl_meta.get("doc_items") if isinstance(dl_meta, dict) else None
    )
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


# ---------------------------------------------------------------------------
# DocumentParser — wraps Docling's DocumentConverter
# ---------------------------------------------------------------------------

class DocumentParser:
    """Lazy-initialised wrapper around Docling's ``DocumentConverter``.

    Handles PDF pipeline configuration (OCR, image extraction, scale)
    and exposes a single ``get_converter()`` method.
    """

    def __init__(self) -> None:
        self._converter: Any | None = None

    def get_converter(self) -> Any:
        """Lazy-load the DocumentConverter with OCR/VLM capabilities."""
        if self._converter is None:
            logger.info(
                "[docling] Initializing DocumentConverter "
                "(this may take a moment)..."
            )
            try:
                from docling.document_converter import (
                    DocumentConverter,
                    PdfFormatOption,
                )
                from docling.datamodel.pipeline_options import (
                    PdfPipelineOptions,
                )
                from docling.datamodel.base_models import InputFormat

                pdf_pipeline_options = PdfPipelineOptions()
                pdf_pipeline_options.generate_page_images = True
                pdf_pipeline_options.images_scale = 2.0
                pdf_pipeline_options.generate_picture_images = True

                self._converter = DocumentConverter(
                    format_options={
                        InputFormat.PDF: PdfFormatOption(
                            pipeline_options=pdf_pipeline_options,
                        ),
                    }
                )
                logger.info(
                    "[docling] DocumentConverter ready "
                    "with Image Extraction enabled."
                )
            except ImportError as ie:
                logger.error(
                    f"[docling] docling package not installed properly! "
                    f"Error: {ie}"
                )
                raise
        return self._converter
