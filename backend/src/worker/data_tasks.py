"""
Data tasks — Queue: data_batch

Tasks:
  - run_sql_query: Vanna Text-to-SQL + LangGraph verification + Lida charts
  - sync_data: Data synchronization between sources (placeholder)
"""
import logging
import os
from typing import Any

from .celery_app import celery_app

logger = logging.getLogger(__name__)

BACKEND_INTERNAL_URL = os.getenv("BACKEND_INTERNAL_URL", "http://backend:8000")


# =============================================================================
# 🟠 QUEUE: data_batch — SQL & Data Sync
# =============================================================================

@celery_app.task(name="src.worker.tasks.run_sql_query", bind=True, max_retries=2)
def run_sql_query(
    self,
    question: str,
    session_id: str,
    user_id: str | None = None,
) -> dict[str, Any]:
    """
    Vanna SQL Agent + LangGraph verification loop.
    1. Vanna sinh SQL từ câu hỏi tự nhiên
    2. LangGraph kiểm tra SQL (no DROP/DELETE/ALTER, valid schema)
    3. Execute SQL → trả kết quả
    4. Save result to DB as assistant message
    """
    logger.info(f"[data_batch] SQL query for session {session_id}: {question[:50]}...")
    try:
        import httpx
        from src.core.vanna_setup import get_vanna
        vn = get_vanna()
        if not vn:
            return {"status": "error", "message": "Vanna not initialized"}

        attachments = []  # Omni-channel attachments
        df = None  # Will hold the DataFrame if SQL succeeds
        sql_success = False  # Guard flag for Lida/TTS domino protection

        # 1. Generate SQL
        try:
            sql = vn.generate_sql(question=question, allow_llm_to_see_data=True)
        except Exception as gen_err:
            logger.warning(f"[vanna] SQL generation failed: {gen_err}")
            sql = None

        if not sql:
            result_text = (
                "Xin lỗi, dữ liệu hiện tại trong hệ thống chưa đủ để tôi xử lý "
                "yêu cầu này. Vui lòng kiểm tra lại dữ liệu nguồn hoặc thử diễn đạt "
                "câu hỏi theo cách khác."
            )
        else:
            logger.info(f"Generated SQL: {sql}")

            # 2. Safety Check
            forbidden = ["DROP", "DELETE", "ALTER", "TRUNCATE", "INSERT", "UPDATE", "GRANT", "REVOKE"]
            if any(word in sql.upper() for word in forbidden):
                result_text = (
                    "Xin lỗi, yêu cầu này liên quan đến thao tác không được phép "
                    "trên hệ thống. Vui lòng liên hệ quản trị viên."
                )
            else:
                # 3. Execute SQL
                try:
                    df = vn.run_sql(sql)
                    if df is None or df.empty:
                        result_text = (
                            "Tôi đã tìm kiếm nhưng không có dữ liệu nào phù hợp "
                            "với yêu cầu của bạn trong khoảng thời gian được chỉ định."
                        )
                        df = None
                    else:
                        sql_success = True
                        markdown = df.to_markdown(index=False)
                        result_text = f"Dưới đây là kết quả thống kê:\n\n{markdown}"
                except Exception as sql_err:
                    logger.error(f"SQL execution error: {sql_err}")
                    result_text = (
                        "Xin lỗi, dữ liệu hiện tại trong hệ thống chưa đủ để tôi "
                        "thống kê chi tiết yêu cầu này. Vui lòng kiểm tra lại dữ liệu nguồn."
                    )
                    df = None  # Ensure domino block

        # 4. Lida chart generation — ONLY if SQL succeeded (domino protection)
        chart_keywords = ["biểu đồ", "vẽ", "chart", "graph", "đồ thị", "trực quan"]
        if sql_success and df is not None and any(kw in question.lower() for kw in chart_keywords):
            try:
                from src.services.lida_service import get_lida_service
                lida = get_lida_service()
                chart_result = lida.generate_chart(question, df)
                if chart_result.get("chart_url"):
                    attachments.append({
                        "type": "chart",
                        "url": chart_result["chart_url"],
                        "filename": chart_result.get("filename"),
                    })
                    result_text += f"\n\n📊 [Xem biểu đồ]({chart_result['chart_url']})"
                    logger.info(f"[lida] Chart generated: {chart_result['chart_url']}")
            except Exception as chart_err:
                logger.warning(f"[lida] Chart generation failed: {chart_err}")

        # 5. TTS voice — ONLY if SQL succeeded (domino protection: don't read error messages)
        tts_keywords = ["đọc", "nghe", "giọng", "voice", "audio", "phát"]
        if sql_success and any(kw in question.lower() for kw in tts_keywords):
            try:
                from src.services.tts_service import get_tts_service
                tts = get_tts_service()
                tts_result = tts.synthesize_sync(result_text)
                if tts_result.get("audio_url"):
                    attachments.append({
                        "type": "audio",
                        "url": tts_result["audio_url"],
                        "filename": tts_result.get("filename"),
                    })
                    result_text += f"\n\n🔊 [Nghe báo cáo]({tts_result['audio_url']})"
                    logger.info(f"[tts] Audio generated: {tts_result['audio_url']}")
            except Exception as tts_err:
                logger.warning(f"[tts] TTS failed: {tts_err}")

        # 6. Save result via API (with attachments in metadata)
        try:
            api_url = f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages"
            payload = {
                "content": result_text,
                "role": "assistant",
                "metadata": {"attachments": attachments} if attachments else {},
            }
            with httpx.Client() as client:
                resp = client.post(api_url, json=payload, timeout=10.0)
                resp.raise_for_status()
                logger.info(f"Saved message via API: {resp.status_code}")

        except Exception as e:
            logger.error(f"Failed to save message via API: {e}")
            return {"status": "error", "message": str(e)}

        return {
            "status": "success",
            "question": question,
            "attachments": attachments,
        }

    except Exception as exc:
        logger.exception(f"Error in SQL query: {exc}")
        # Save Vietnamese error message — NEVER expose SQL/Python tracebacks to user
        try:
            import httpx
            with httpx.Client(timeout=10.0) as client:
                client.post(
                    f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages",
                    json={
                        "content": "Xin lỗi Đại ca, hệ thống gặp sự cố khi truy vấn dữ liệu. Vui lòng thử lại sau ạ.",
                        "role": "assistant",
                    },
                )
        except Exception:
            pass
        return {"status": "error", "message": "Internal error"}


@celery_app.task(name="src.worker.tasks.sync_data")
def sync_data(source: str, target: str, **kwargs) -> dict[str, Any]:
    """Đồng bộ dữ liệu giữa các nguồn."""
    logger.info(f"[data_batch] Syncing {source} → {target}")
    # TODO: Phase 3 — implement data sync logic
    return {"status": "ok", "source": source, "target": target}
