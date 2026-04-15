"""Chunking logic for Docling documents.

Provides ``DocumentChunker`` which builds embedding-ready chunks
using Docling's ``HybridChunker`` with adaptive table serialisation,
heading prefixes, and group-lock merging.
"""
from __future__ import annotations

import logging
import os
from typing import Any

from .models import ChunkData
from .parser import (
    env_bool,
    env_int,
    extract_page_from_chunk_meta,
    extract_row_keys,
    normalize_group_hints,
    normalize_money_and_unit,
    pick_group_key_col,
    slugify_key,
    table_page_no,
)
from .table_detector import build_serializer_provider

logger = logging.getLogger(__name__)


class DocumentChunker:
    """Builds chunk lists using Docling ``HybridChunker`` + adaptive table
    serialiser.

    All configuration is read from environment variables at call time.
    """

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def build_embedding_prefix(
        headings: list[str],
        row_keys: list[str],
    ) -> str:
        """Build a contextual prefix string for embedding text."""
        prefix_parts: list[str] = []
        clean_headings = [
            h.strip() for h in headings if h and h.strip()
        ]
        if clean_headings:
            prefix_parts.append(
                f"heading: {' > '.join(clean_headings[-3:])}"
            )
        if row_keys:
            prefix_parts.append(
                f"row_key: {', '.join(row_keys[:3])}"
            )
        return " | ".join(prefix_parts)

    @staticmethod
    def apply_group_lock(
        chunks: list[ChunkData],
        *,
        max_chars: int,
    ) -> list[ChunkData]:
        """Merge adjacent chunks sharing table row keys.

        Uses a conservative token estimate (chars / 3) to stay within the
        embedding model's token budget.  Vietnamese text averages ~3-4
        chars per token, so dividing by 3 gives a safe upper-bound.
        """
        if len(chunks) < 2:
            return chunks

        max_tokens = int(os.getenv("DOCLING_CHUNK_MAX_TOKENS", "2048"))
        token_safe_max_chars = max_tokens * 3
        effective_max_chars = min(max_chars, token_safe_max_chars)

        merged: list[ChunkData] = []
        current = chunks[0]

        for nxt in chunks[1:]:
            current_meta = (
                current.metadata
                if isinstance(current.metadata, dict)
                else {}
            )
            next_meta = (
                nxt.metadata if isinstance(nxt.metadata, dict) else {}
            )
            current_keys = current_meta.get("row_keys") or []
            next_keys = next_meta.get("row_keys") or []

            shared_keys = set(current_keys).intersection(next_keys)
            can_merge = (
                bool(shared_keys)
                and current.page_number == nxt.page_number
                and (
                    len(current.text) + len(nxt.text) + 1
                    <= effective_max_chars
                )
            )

            if can_merge:
                current.text = f"{current.text}\n{nxt.text}"
                current_keys_merged = list(
                    dict.fromkeys([*current_keys, *next_keys])
                )
                current_meta["row_keys"] = current_keys_merged
                current.metadata = current_meta
            else:
                merged.append(current)
                current = nxt

        merged.append(current)
        return merged

    # ------------------------------------------------------------------
    # Main entry point
    # ------------------------------------------------------------------

    def build_chunks(
        self,
        doc: Any,
        source_file: str,
    ) -> list[ChunkData]:
        """Build chunk list using Docling HybridChunker + adaptive table
        serialiser.

        Falls back to an empty list when optional dependencies or the
        tokeniser are unavailable.
        """
        try:
            from docling.chunking import HybridChunker
            from docling_core.transforms.chunker.tokenizer.huggingface import (
                HuggingFaceTokenizer,
            )
            from transformers import AutoTokenizer
        except Exception as exc:
            logger.warning(
                f"[docling] Hybrid chunking imports unavailable: {exc}"
            )
            return []

        # ── Read config from env ──────────────────────────────────────
        group_key_hints = normalize_group_hints(
            os.getenv("DOCLING_TABLE_GROUP_KEY_HINTS")
        )
        keep_heading_prefix = env_bool(
            "DOCLING_PREFIX_HEADING_ROWKEY", True
        )
        enable_group_lock = env_bool(
            "DOCLING_GROUP_LOCK_ENABLED", True
        )
        group_lock_max_chars = env_int(
            "DOCLING_GROUP_LOCK_MAX_CHARS", 1800, minimum=256
        )

        # ── Build serialiser provider ─────────────────────────────────
        table_config = {
            "markdown_max_cols": env_int(
                "DOCLING_TABLE_MARKDOWN_MAX_COLS", 4
            ),
            "markdown_max_cells": env_int(
                "DOCLING_TABLE_MARKDOWN_MAX_CELLS", 36
            ),
            "group_key_hints": group_key_hints,
            "normalize_table_values": env_bool(
                "DOCLING_TABLE_NORMALIZE_VALUES", True
            ),
        }
        serializer_provider = build_serializer_provider(table_config)

        # ── Resolve tokeniser ─────────────────────────────────────────
        max_tokens_raw = os.getenv("DOCLING_CHUNK_MAX_TOKENS", "2048")
        merge_peers_raw = os.getenv(
            "DOCLING_CHUNK_MERGE_PEERS", "true"
        )
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

        merge_peers = merge_peers_raw.strip().lower() in {
            "1",
            "true",
            "yes",
            "on",
        }

        tokenizer = None
        tried_models: set[str] = set()
        for model_id in model_candidates:
            if not model_id or model_id in tried_models:
                continue
            tried_models.add(model_id)
            try:
                hf_tok = AutoTokenizer.from_pretrained(model_id)
                tokenizer = HuggingFaceTokenizer(
                    tokenizer=hf_tok, max_tokens=max_tokens
                )
                logger.info(
                    f"[docling] Using tokenizer model: {model_id}"
                )
                break
            except Exception as exc:
                logger.warning(
                    f"[docling] Failed loading tokenizer "
                    f"'{model_id}': {exc}"
                )

        if tokenizer is None:
            logger.warning(
                "[docling] Could not initialize tokenizer "
                "for HybridChunker."
            )
            return []

        # ── Run HybridChunker ─────────────────────────────────────────
        try:
            chunker = HybridChunker(
                tokenizer=tokenizer,
                serializer_provider=serializer_provider,
                merge_peers=merge_peers,
            )
            raw_chunks = list(chunker.chunk(dl_doc=doc))
        except Exception as exc:
            logger.warning(
                f"[docling] Failed to create chunks via "
                f"HybridChunker: {exc}"
            )
            return []

        # ── Post-process chunks ───────────────────────────────────────
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
                dl_meta = (
                    chunk.meta.model_dump()
                    if chunk.meta is not None
                    else {}
                )
            except Exception:
                dl_meta = {}

            headings = (
                dl_meta.get("headings")
                if isinstance(dl_meta, dict)
                else None
            )
            if isinstance(headings, list):
                heading_list = [
                    str(h).strip()
                    for h in headings
                    if str(h).strip()
                ]
            elif headings:
                heading_list = [str(headings).strip()]
            else:
                heading_list = []

            row_keys = extract_row_keys(text)
            if row_keys:
                dl_meta["row_keys"] = row_keys
                dl_meta["has_cell_provenance"] = True

            if keep_heading_prefix:
                prefix = self.build_embedding_prefix(
                    heading_list, row_keys
                )
                if prefix:
                    text = f"[chunk_context {prefix}]\n{text}"

            page_number = extract_page_from_chunk_meta(dl_meta)
            chunks.append(
                ChunkData(
                    text=text,
                    page_number=page_number,
                    headings=heading_list,
                    metadata=dl_meta,
                )
            )

        if enable_group_lock:
            chunks = self.apply_group_lock(
                chunks, max_chars=group_lock_max_chars
            )

        logger.info(
            f"[docling] Hybrid chunking generated {len(chunks)} "
            f"chunks for {source_file}"
        )
        return chunks
