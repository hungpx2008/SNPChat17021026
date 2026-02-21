from __future__ import annotations

import asyncio
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from src.api import chat as chat_router
from src.api import admin as admin_router
from src.api import upload as upload_router
from src.api import feedback as feedback_router
from src.api import tts as tts_router
from src.core.config import get_settings
from src.core.db import get_engine, create_tables
from src.core.qdrant_setup import get_qdrant_client
from src.models import models  # noqa: F401 — register ORM models with Base.metadata

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan (replaces deprecated @app.on_event)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle for FastAPI."""
    # --- Startup ---
    await create_tables()
    get_engine()
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, get_qdrant_client)
    logger.info("ChatSNP Backend started successfully.")
    yield
    # --- Shutdown ---
    try:
        from src.core.mem0_config import _client
        if _client is not None:
            await _client.aclose()
    except Exception:
        pass


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="ChatSNP Backend", version="0.1.0", lifespan=lifespan)

    logger.info("Allowed Origins: %s", settings.allowed_origins)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global exception handler — NEVER leak internal details to client
    @app.exception_handler(Exception)
    async def global_exception_handler(request, exc):
        logger.exception("Unhandled exception:")

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
            content={"detail": "Internal Server Error"},
            headers=headers,
        )

    # Routers
    app.include_router(chat_router.router)
    app.include_router(admin_router.router)
    app.include_router(upload_router.router)
    app.include_router(feedback_router.router)
    app.include_router(tts_router.router)

    # Serve media files (charts, audio, uploads) as static assets
    media_dir = "/app/media"
    for sub in ("charts", "tts", "uploads"):
        os.makedirs(os.path.join(media_dir, sub), exist_ok=True)
    app.mount("/media", StaticFiles(directory=media_dir), name="media")

    return app


app = create_app()
