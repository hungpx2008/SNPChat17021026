"""
Data tasks — Queue: data_batch

Tasks:
  - run_sql_query: Vanna Text-to-SQL + LangGraph verification + Lida charts
  - sync_data: Data synchronization between sources (placeholder)
"""
import logging
import os
from typing import Any, Literal

from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider

from .celery_app import celery_app

logger = logging.getLogger(__name__)

# Initialize the model (OpenRouter) — reads from LLM_MODEL env var
openai_key = os.getenv("OPENAI_API_KEY", "")
openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
llm_model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")

model = OpenAIModel(
    llm_model,
    provider=OpenAIProvider(base_url=openai_base, api_key=openai_key),
)

class SQLAgentResult(BaseModel):
    """Schema for the SQL agent's final output."""
    sql: str = Field(description="The final corrected SQL query")
    explanation: str = Field(description="Brief explanation of what the query does or what was fixed")

# ---------------------------------------------------------------------------
# The SQL Agent
# ---------------------------------------------------------------------------
sql_agent = Agent(
    model,
    output_type=SQLAgentResult,
    system_prompt=(
        "You are a SQL Expert for ChatSNP Vietnamese Port System. "
        "Your goal is to provide a valid, safe, and efficient SQL query for the user's question. "
        "If a query fails, use your tools to inspect the schema and fix it. "
        "Return the SQL and a brief Vietnamese explanation. "
        "Follow these rules:\n"
        "1. Only SELECT queries are allowed.\n"
        "2. Do not use DROP, DELETE, INSERT, UPDATE, or ALTER.\n"
        "3. Use the Vietnamese language for explanations."
    ),
)

@sql_agent.tool
async def execute_sql(ctx: RunContext[dict[str, Any]], sql: str) -> str:
    """Execute a SQL query and return the result as a string (or error)."""
    try:
        from src.core.vanna_setup import get_vanna
        vn = get_vanna()
        df = vn.run_sql(sql)
        if df is None or df.empty:
            return "Query returned no results."
        return df.to_string(index=False)
    except Exception as e:
        return f"SQL Error: {str(e)}"

@sql_agent.tool
async def get_db_schema(ctx: RunContext[dict[str, Any]]) -> str:
    """Retrieve the database schema information (tables and columns)."""
    try:
        from src.core.vanna_setup import get_vanna
        vn = get_vanna()
        # Vanna keeps training data which includes DDL/schema
        # We can also fetch from information_schema
        # For simplicity, we return the training data summary
        return str(vn.get_training_data())
    except Exception as e:
        return f"Could not fetch schema: {str(e)}"


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

        # 1. Generate & Refine SQL using the Agent
        try:
            # We start with Vanna's initial suggestion if available
            initial_sql = ""
            try:
                initial_sql = vn.generate_sql(question=question, allow_llm_to_see_data=True)
                logger.info(f"[vanna] Initial SQL: {initial_sql}")
            except Exception:
                pass

            # Run the agent to verify/fix the SQL
            prompt = f"Question: {question}\nInitial SQL Suggestion: {initial_sql}"
            
            import asyncio
            agent_run = asyncio.run(sql_agent.run(prompt))
            
            sql = agent_run.output.sql
            explanation = agent_run.output.explanation
            logger.info(f"[sql_agent] Final SQL: {sql}")
        except Exception as agent_err:
            logger.error(f"[sql_agent] Agent failed: {agent_err}")
            sql = None

        if not sql:
            result_text = (
                "Xin lỗi Đại ca, em đã cố gắng truy vấn dữ liệu nhưng hiện tại "
                "chưa thể tìm thấy thông tin phù hợp. Vui lòng thử lại sau ạ."
            )
        else:
            # 2. Safety Check (Secondary guard)
            forbidden = ["DROP", "DELETE", "ALTER", "TRUNCATE", "INSERT", "UPDATE"]
            if any(word in sql.upper() for word in forbidden):
                result_text = "Thao tác này không được phép trên hệ thống."
            else:
                # 3. Final Execution
                try:
                    df = vn.run_sql(sql)
                    if df is None or df.empty:
                        result_text = "Không tìm thấy dữ liệu phù hợp trong khoảng thời gian này."
                        df = None
                    else:
                        sql_success = True
                        markdown = df.to_markdown(index=False)
                        result_text = f"{explanation}\n\n{markdown}"
                except Exception as sql_err:
                    logger.error(f"Execution failed after agent refinement: {sql_err}")
                    result_text = "Hệ thống gặp sự cố khi xử lý dữ liệu. Em sẽ báo cáo kỹ thuật kiểm tra lại ạ."
                    df = None

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

        # Notify frontend via SSE that the response is ready
        from .helpers import publish_task_complete
        publish_task_complete(session_id)

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
        # Still notify frontend so it stops waiting
        from .helpers import publish_task_complete
        publish_task_complete(session_id)
        return {"status": "error", "message": "Internal error"}


@celery_app.task(name="src.worker.tasks.sync_data")
def sync_data(source: str, target: str, **kwargs) -> dict[str, Any]:
    """Đồng bộ dữ liệu giữa các nguồn."""
    logger.info(f"[data_batch] Syncing {source} → {target}")
    # TODO: Phase 3 — implement data sync logic
    return {"status": "ok", "source": source, "target": target}
