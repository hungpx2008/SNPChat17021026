"""
FastAPI entrypoint exposing health checks for Teable sync backend.
"""

from __future__ import annotations

import asyncio
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from .db.postgres import check_postgres_connection
from .db.qdrant import check_qdrant_connection
from .db.redis import check_redis_connection
from .teable_sync_service import TeableSyncService
from .utils.logger import get_logger

# Load environment variables from .env if present.
load_dotenv()

logger = get_logger("teable-sync-api")

app = FastAPI(title="Teable Sync Service", version="1.0.0")


@app.on_event("startup")
async def on_startup() -> None:
    logger.info("Teable Sync API starting with PID=%s", os.getpid())


@app.on_event("shutdown")
async def on_shutdown() -> None:
    logger.info("Teable Sync API shutting down")


@app.get("/health", response_class=JSONResponse, tags=["system"])
async def health_check() -> JSONResponse:
    """
    Kiểm tra trạng thái kết nối tới PostgreSQL, Redis và Qdrant.
    """
    postgres_ok, redis_ok = await asyncio.gather(
        check_postgres_connection(),
        check_redis_connection(),
    )

    qdrant_ok = check_qdrant_connection()

    status = {
        "postgres": "connected" if postgres_ok else "error",
        "redis": "connected" if redis_ok else "error",
        "qdrant": "connected" if qdrant_ok else "error",
    }

    http_status = 200 if all(value == "connected" for value in status.values()) else 503
    return JSONResponse(content=status, status_code=http_status)


@app.post("/sync/{table_name}", tags=["sync"])
async def manual_sync(table_name: str) -> JSONResponse:
    """
    Endpoint thủ công để đồng bộ một bảng cụ thể từ Teable.
    """
    service = TeableSyncService()
    try:
        await service.sync_from_teable(table_name)
        payload = {"status": "ok", "message": f"Table '{table_name}' synced"}
        return JSONResponse(content=payload, status_code=200)
    finally:
        await service.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
