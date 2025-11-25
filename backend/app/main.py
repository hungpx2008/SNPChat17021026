from __future__ import annotations

import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routers import sessions as sessions_router
from .api.routers import admin as admin_router
from .config import get_settings
from .db import get_engine
from .qdrant_client import get_qdrant_client


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="ChatSNP Backend", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    async def on_startup() -> None:
        get_engine()
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, get_qdrant_client)

    app.include_router(sessions_router.router)
    app.include_router(admin_router.router)
    return app


app = create_app()
