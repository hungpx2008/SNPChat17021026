"""
Lida Service — Automatic chart/visualization generation.

Uses Microsoft Lida (Language Interface for Data Analysis) to generate
charts from DataFrames. Saves as PNG to /app/media/charts/.
"""
from __future__ import annotations

import logging
import os
from uuid import uuid4

import pandas as pd

logger = logging.getLogger(__name__)

CHARTS_DIR = "/app/media/charts"
BACKEND_BASE_URL = os.getenv("BACKEND_EXTERNAL_URL", "http://localhost:8000")


class LidaService:
    """Generate visualizations from DataFrames using Lida."""

    def __init__(self):
        self._manager = None

    def _get_manager(self):
        """Lazy-load Lida Manager."""
        if self._manager is None:
            logger.info("[lida] Initializing Lida Manager...")
            try:
                from lida import Manager, TextGenerationConfig, llm

                openai_key = os.getenv("OPENAI_API_KEY", "")
                openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
                model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")

                text_gen = llm(
                    provider="openai",
                    api_key=openai_key,
                    api_base=openai_base,
                )
                self._manager = Manager(text_gen=text_gen)
                self._model = model
                logger.info("[lida] Manager ready.")
            except ImportError:
                logger.error("[lida] lida package not installed!")
                raise
        return self._manager

    def generate_chart(
        self,
        query: str,
        df: pd.DataFrame,
        chart_type: str = "auto",
    ) -> dict:
        """
        Generate a chart from a DataFrame.

        Returns: {"chart_path": "/app/media/...", "chart_url": "http://.../media/..."}
        """
        os.makedirs(CHARTS_DIR, exist_ok=True)
        chart_id = str(uuid4())[:8]
        filename = f"chart_{chart_id}.png"
        filepath = os.path.join(CHARTS_DIR, filename)

        try:
            manager = self._get_manager()

            # Lida flow: summarize → generate goals → generate viz
            from lida import TextGenerationConfig
            textgen_config = TextGenerationConfig(
                n=1, temperature=0.2, model=self._model, use_cache=False
            )

            # Summarize the data
            summary = manager.summarize(
                data=df,
                summary_method="default",
                textgen_config=textgen_config,
            )

            # Build specific goal
            goal = f"{query}. Chart type preference: {chart_type}"

            # Generate visualization
            charts = manager.visualize(
                summary=summary,
                goal=goal,
                textgen_config=textgen_config,
                library="matplotlib",
            )

            if charts and len(charts) > 0:
                chart = charts[0]
                # Save raster image
                if hasattr(chart, "raster") and chart.raster:
                    import base64
                    img_data = base64.b64decode(chart.raster)
                    with open(filepath, "wb") as f:
                        f.write(img_data)
                elif hasattr(chart, "savefig"):
                    chart.savefig(filepath, dpi=150, bbox_inches="tight")
                else:
                    # Fallback: try executing the code to make a matplotlib figure
                    self._execute_viz_code(chart, df, filepath)

                chart_url = f"{BACKEND_BASE_URL}/media/charts/{filename}"
                logger.info(f"[lida] Chart saved: {filepath}")
                return {
                    "chart_path": filepath,
                    "chart_url": chart_url,
                    "filename": filename,
                }

            logger.warning("[lida] No charts generated")
            return {"chart_path": None, "chart_url": None, "filename": None}

        except Exception as e:
            logger.exception(f"[lida] Chart generation failed: {e}")
            # Fallback: generate a simple matplotlib chart
            return self._fallback_chart(query, df, filepath, filename)

    def _execute_viz_code(self, chart, df: pd.DataFrame, filepath: str) -> None:
        """Execute Lida's generated viz code to produce a chart."""
        if hasattr(chart, "code") and chart.code:
            import matplotlib
            matplotlib.use("Agg")
            import matplotlib.pyplot as plt

            # Execute the generated code
            exec_globals = {"df": df, "pd": pd, "plt": plt}
            try:
                exec(chart.code, exec_globals)
                plt.savefig(filepath, dpi=150, bbox_inches="tight")
                plt.close("all")
            except Exception as e:
                logger.warning(f"[lida] Code execution failed: {e}")
                plt.close("all")
                raise

    def _fallback_chart(
        self, query: str, df: pd.DataFrame, filepath: str, filename: str
    ) -> dict:
        """Generate a simple matplotlib chart as fallback."""
        try:
            import matplotlib
            matplotlib.use("Agg")
            import matplotlib.pyplot as plt

            fig, ax = plt.subplots(figsize=(10, 6))

            if len(df.columns) >= 2:
                # Try bar chart with first two columns
                x_col = df.columns[0]
                y_col = df.select_dtypes(include=["number"]).columns[0] if len(df.select_dtypes(include=["number"]).columns) > 0 else df.columns[1]

                if len(df) <= 20:
                    ax.bar(df[x_col].astype(str), pd.to_numeric(df[y_col], errors="coerce"))
                else:
                    ax.plot(pd.to_numeric(df[y_col], errors="coerce"))

                ax.set_xlabel(str(x_col))
                ax.set_ylabel(str(y_col))
            else:
                df.plot(ax=ax)

            ax.set_title(query[:60])
            plt.xticks(rotation=45, ha="right")
            plt.tight_layout()
            plt.savefig(filepath, dpi=150, bbox_inches="tight")
            plt.close("all")

            chart_url = f"{BACKEND_BASE_URL}/media/charts/{filename}"
            logger.info(f"[lida] Fallback chart saved: {filepath}")
            return {
                "chart_path": filepath,
                "chart_url": chart_url,
                "filename": filename,
            }
        except Exception as e:
            logger.exception(f"[lida] Fallback chart also failed: {e}")
            return {"chart_path": None, "chart_url": None, "filename": None}


# Module-level singleton
_service: LidaService | None = None


def get_lida_service() -> LidaService:
    global _service
    if _service is None:
        _service = LidaService()
    return _service
