"""Table serialisation for Docling chunking.

Defines ``AdaptiveTableSerializer`` (hybrid Markdown + triplet serialiser)
and ``TripletSerializerProvider`` which plugs into Docling's
``HybridChunker``.

Both classes were originally nested inside ``DoclingProcessor`` and
referenced outer-scope closures.  They now accept an explicit *config*
dict so they can live as standalone, importable classes.

Expected *config* keys (with defaults):
  - ``markdown_max_cols``  (int, 4)
  - ``markdown_max_cells`` (int, 36)
  - ``group_key_hints``    (list[str])
  - ``normalize_table_values`` (bool, True)
"""
from __future__ import annotations

import logging
from typing import Any

from .parser import (
    normalize_money_and_unit,
    pick_group_key_col,
    slugify_key,
    table_page_no,
)

logger = logging.getLogger(__name__)


def _get_table_config(config: dict[str, Any]) -> tuple[int, int, list[str], bool]:
    """Unpack and validate table configuration dict."""
    markdown_max_cols = int(config.get("markdown_max_cols", 4))
    markdown_max_cells = int(config.get("markdown_max_cells", 36))
    group_key_hints: list[str] = config.get("group_key_hints", [])
    normalize_values = bool(config.get("normalize_table_values", True))
    return markdown_max_cols, markdown_max_cells, group_key_hints, normalize_values


class AdaptiveTableSerializer:
    """Hybrid serialiser for arbitrary tables with optional value normalisation.

    Plugs into Docling's ``BaseTableSerializer`` protocol.  Small tables
    get full Markdown; larger ones get a compact triplet representation
    with optional currency/unit normalisation for better retrieval.
    """

    def __init__(self, config: dict[str, Any] | None = None) -> None:
        self._config = config or {}

    def serialize(
        self,
        *,
        item: Any,
        doc_serializer: Any,
        doc: Any,
        **kwargs: Any,
    ) -> Any:
        """Serialize a single table item."""
        # Late imports — only needed at call time inside a chunking run.
        from docling_core.transforms.serializer.common import (
            create_ser_result,
        )

        (
            markdown_max_cols,
            markdown_max_cells,
            group_key_hints,
            normalize_values,
        ) = _get_table_config(self._config)

        parts: list[Any] = []

        cap_res = doc_serializer.serialize_captions(
            item=item, **kwargs
        )
        if cap_res.text:
            parts.append(cap_res)

        if item.self_ref in doc_serializer.get_excluded_refs(**kwargs):
            text_res = "\n\n".join([r.text for r in parts])
            return create_ser_result(
                text=text_res, span_source=parts
            )

        table_df = item.export_to_dataframe(doc=doc)
        if table_df.shape[0] < 1 or table_df.shape[1] < 2:
            text_res = "\n\n".join([r.text for r in parts])
            return create_ser_result(
                text=text_res, span_source=parts
            )

        # Align with default triplet serialiser: prepend headers as
        # first row, then iterate data rows/cols from index 1.
        table_df.loc[-1] = table_df.columns  # type: ignore[call-overload]
        table_df.index = table_df.index + 1
        table_df = table_df.sort_index()

        rows = [
            str(v).strip() for v in table_df.iloc[:, 0].to_list()
        ]
        cols = [
            str(v).strip() for v in table_df.iloc[0, :].to_list()
        ]
        nrows, ncols = table_df.shape
        data_cells = max(0, nrows - 1) * max(0, ncols - 1)
        page_no = table_page_no(item)

        group_col_idx = pick_group_key_col(
            cols, table_df, group_key_hints
        )
        if group_col_idx < 0 or group_col_idx >= ncols:
            group_col_idx = 0

        is_small_table = (
            ncols <= markdown_max_cols
            and data_cells <= markdown_max_cells
        )
        table_text_parts: list[str] = []

        for i in range(1, nrows):
            group_value = str(
                table_df.iloc[i, group_col_idx]
            ).strip()
            if not group_value:
                group_value = (
                    rows[i] if i < len(rows) else f"row_{i}"
                )
            row_key = slugify_key(group_value)

            for j in range(1, ncols):
                col_key_raw = (
                    cols[j] if j < len(cols) else f"col_{j}"
                )
                col_key = slugify_key(col_key_raw)
                cell_value_raw = str(
                    table_df.iloc[i, j]
                ).strip()
                normalized = (
                    normalize_money_and_unit(cell_value_raw)
                    if normalize_values
                    else ""
                )

                base_text = (
                    f"{group_value}, {col_key_raw} = "
                    f"{cell_value_raw}"
                )
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
                table_text = (
                    f"{table_markdown}\n\n"
                    + "\n".join(table_text_parts)
                )
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

        parts.append(
            create_ser_result(text=table_text, span_source=item)
        )
        text_res = "\n\n".join([r.text for r in parts])
        return create_ser_result(text=text_res, span_source=parts)


class TripletSerializerProvider:
    """Provides a ``ChunkingDocSerializer`` wired to our adaptive table
    serialiser.

    Docling may call ``get_serializer`` with a positional *doc* or a
    keyword ``doc=...`` depending on the version.
    """

    def __init__(self, config: dict[str, Any] | None = None) -> None:
        self._config = config or {}

    def get_serializer(self, doc: Any = None, **kwargs: Any) -> Any:
        """Return a ``ChunkingDocSerializer`` for the given document."""
        from docling_core.transforms.chunker.hierarchical_chunker import (
            ChunkingDocSerializer,
        )
        from docling_core.transforms.serializer.markdown import (
            MarkdownParams,
        )

        local_doc = doc if doc is not None else kwargs.get("doc")
        if local_doc is None:
            raise ValueError(
                "Docling serializer provider received no "
                "document instance"
            )
        return ChunkingDocSerializer(
            doc=local_doc,
            table_serializer=AdaptiveTableSerializer(
                config=self._config,
            ),
            params=MarkdownParams(
                image_placeholder="<!-- image -->"
            ),
        )


def build_serializer_provider(
    config: dict[str, Any],
) -> TripletSerializerProvider:
    """Factory: create a ``TripletSerializerProvider`` with the given
    table configuration.

    This is the preferred entry point used by ``DocumentChunker``.
    """
    return TripletSerializerProvider(config=config)
