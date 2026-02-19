from __future__ import annotations

import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api import chat as chat_router
from src.api import admin as admin_router
from src.core.config import get_settings
from src.core.db import get_engine, create_tables
from src.core.qdrant_setup import get_qdrant_client
from src.models import models  # noqa: F401 — register ORM models with Base.metadata


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="ChatSNP Backend", version="0.1.0")

    print(f"DEBUG: Allowed Origins: {settings.allowed_origins}")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(Exception)
    async def global_exception_handler(request, exc):
        import logging
        logging.exception("Unhandled exception:")
        from fastapi.responses import JSONResponse
        
        origin = request.headers.get("origin", "")
        allow_origin = "*" if "*" in settings.allowed_origins else (
            origin if origin in settings.allowed_origins else (
                settings.allowed_origins[0] if settings.allowed_origins else "*"
            )
        )
        headers = {
            "Access-Control-Allow-Origin": allow_origin,
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
        }
        
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc), "type": type(exc).__name__},
            headers=headers
        )

    @app.on_event("startup")
    async def on_startup() -> None:
        await create_tables()
        get_engine()
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, get_qdrant_client)

    @app.on_event("shutdown")
    async def on_shutdown() -> None:
        from src.core.mem0_config import _client
        if _client is not None:
            await _client.aclose()

    app.include_router(chat_router.router)
    app.include_router(admin_router.router)
    return app


app = create_app()
