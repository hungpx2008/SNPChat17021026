"""
Gardener tasks — Nightly Memory Consolidation

Runs via Celery Beat at 2:00 AM daily.
Task:
  - consolidate_memories: Dedup facts, assign importance_score, optimize retrieval
"""
import json
import logging
import os
from typing import Any

from .celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="src.worker.tasks.consolidate_memories", bind=True, max_retries=1)
def consolidate_memories(self) -> dict[str, Any]:
    """
    Nightly Memory Gardener — chạy 2h sáng mỗi ngày.
    
    1. Fetch ALL memories from Mem0
    2. Group by user_id
    3. For each user: call LLM to identify duplicates + assign importance_score
    4. Update/merge facts via Mem0 API
    """
    logger.info("[gardener] Starting nightly memory consolidation...")
    try:
        import httpx
        mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")
        openai_key = os.getenv("OPENAI_API_KEY", "")
        openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
        llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")

        # Get all user IDs from sessions (quick DB scan)
        from sqlalchemy import create_engine, text as sql_text
        db_url = os.getenv("DATABASE_URL", "").replace("postgresql+asyncpg://", "postgresql://")
        engine = create_engine(db_url)

        with engine.connect() as conn:
            result = conn.execute(
                sql_text("SELECT DISTINCT user_id FROM chat_sessions WHERE user_id IS NOT NULL")
            )
            user_ids = [row[0] for row in result.fetchall()]

        logger.info(f"[gardener] Found {len(user_ids)} users to consolidate")
        stats = {"users_processed": 0, "facts_updated": 0, "facts_merged": 0}

        for uid in user_ids:
            try:
                # 1. Fetch all memories for this user
                with httpx.Client(timeout=30.0) as client:
                    resp = client.get(
                        f"{mem0_url.rstrip('/')}/memories",
                        params={"user_id": uid},
                    )
                    if resp.status_code != 200:
                        logger.warning(f"[gardener] Fetch memories failed for {uid}: {resp.status_code}")
                        continue
                    memories = resp.json()

                if not memories or len(memories) < 2:
                    continue  # Nothing to consolidate

                # Extract text of each memory
                memory_texts = []
                for m in memories:
                    mid = m.get("id", "")
                    text = m.get("memory") or m.get("text") or ""
                    metadata = m.get("metadata") or {}
                    memory_texts.append({
                        "id": mid,
                        "text": text[:300],
                        "has_score": "importance_score" in metadata,
                        "current_score": metadata.get("importance_score"),
                    })

                # 2. Call LLM to analyze
                memory_list = "\n".join(f"[{m['id']}] {m['text']}" for m in memory_texts)

                with httpx.Client(timeout=120.0) as client:
                    llm_resp = client.post(
                        f"{openai_base.rstrip('/')}/chat/completions",
                        headers={
                            "Authorization": f"Bearer {openai_key}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": llm_model,
                            "messages": [
                                {
                                    "role": "system",
                                    "content": (
                                        "Bạn là hệ thống quản lý bộ nhớ. Phân tích danh sách facts sau:\n"
                                        "1. Tìm facts TRÙNG LẶP hoặc MÂU THUẪN → ghi 'MERGE: [id1] + [id2] → merged_text'\n"
                                        "2. Gán importance_score (1-10) cho MỖI fact:\n"
                                        "   - Nghiệp vụ Cảng (số liệu, quy định, biểu giá): 8-10\n"
                                        "   - Thông tin cá nhân (sở thích, hỏi thăm): 3-5\n"
                                        "   - Xã giao (chào hỏi, khen): 1-2\n"
                                        "Trả lời dạng JSON:\n"
                                        '{"scores": [{"id": "...", "score": N}], '
                                        '"merges": [{"keep_id": "...", "remove_id": "...", "merged_text": "..."}]}'
                                    ),
                                },
                                {"role": "user", "content": memory_list[:8000]},
                            ],
                            "temperature": 0.1,
                            "max_tokens": 2000,
                            "response_format": {"type": "json_object"},
                        },
                    )
                    llm_resp.raise_for_status()
                    analysis = json.loads(llm_resp.json()["choices"][0]["message"]["content"])

                # 3. Apply scores
                scores = analysis.get("scores", [])
                for s in scores:
                    mid = s.get("id")
                    score = s.get("score")
                    if mid and isinstance(score, (int, float)):
                        try:
                            with httpx.Client(timeout=10.0) as client:
                                client.put(
                                    f"{mem0_url.rstrip('/')}/memories/{mid}",
                                    json={"metadata": {"importance_score": int(score)}},
                                )
                                stats["facts_updated"] += 1
                        except Exception:
                            pass

                # 4. Apply merges
                merges = analysis.get("merges", [])
                for merge in merges:
                    keep_id = merge.get("keep_id")
                    remove_id = merge.get("remove_id")
                    merged_text = merge.get("merged_text")
                    if keep_id and remove_id and merged_text:
                        try:
                            with httpx.Client(timeout=10.0) as client:
                                # Update the kept memory with merged text
                                client.put(
                                    f"{mem0_url.rstrip('/')}/memories/{keep_id}",
                                    json={"data": merged_text},
                                )
                                # Delete the duplicate
                                client.delete(f"{mem0_url.rstrip('/')}/memories/{remove_id}")
                                stats["facts_merged"] += 1
                        except Exception as e:
                            logger.warning(f"[gardener] Merge failed: {e}")

                stats["users_processed"] += 1
                logger.info(f"[gardener] Processed user {uid}: {len(scores)} scored, {len(merges)} merged")

            except Exception as user_err:
                logger.warning(f"[gardener] Error processing user {uid}: {user_err}")
                continue

        logger.info(f"[gardener] Consolidation complete: {stats}")
        return {"status": "ok", **stats}

    except Exception as exc:
        logger.exception(f"[gardener] Consolidation failed: {exc}")
        return {"status": "error", "message": str(exc)}
