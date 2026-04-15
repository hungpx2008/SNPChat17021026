"""CORS helpers for manual origin resolution.

FastAPI's CORSMiddleware does NOT apply headers to StreamingResponse or
global exception handlers. These helpers deduplicate the origin-resolution
logic used by SSE endpoints and the global 500 handler.
"""
from __future__ import annotations

from fastapi import Request

from src.core.config import get_settings
from src.core.constants import CORS_ALLOW_HEADERS, CORS_ALLOW_METHODS, CORS_MAX_AGE


def resolve_cors_origin(request: Request) -> str:
    """Resolve the correct Access-Control-Allow-Origin for *request*.

    Logic:
    1. If settings contains wildcard "*" → return "*"
    2. If request Origin header is in allowed list → return that origin
    3. If allowed_origins has entries → return the first one
    4. Fallback → "*"
    """
    settings = get_settings()
    origin = request.headers.get("origin", "")
    if "*" in settings.allowed_origins:
        return "*"
    if origin in settings.allowed_origins:
        return origin
    if settings.allowed_origins:
        return settings.allowed_origins[0]
    return "*"


def build_cors_headers(
    request: Request,
    *,
    is_preflight: bool = False,
    is_sse: bool = False,
) -> dict[str, str]:
    """Build a complete CORS header dict for manual responses.

    Parameters
    ----------
    request : Request
        The incoming request (used to read Origin header).
    is_preflight : bool
        If True, include Access-Control-Max-Age for OPTIONS responses.
    is_sse : bool
        If True, include Vary: Origin for streaming responses.

    Returns
    -------
    dict[str, str]
        Headers to merge into the Response.
    """
    allow_origin = resolve_cors_origin(request)
    methods = ", ".join(CORS_ALLOW_METHODS)
    headers_val = ", ".join(CORS_ALLOW_HEADERS)

    result: dict[str, str] = {
        "Access-Control-Allow-Origin": allow_origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": methods,
        "Access-Control-Allow-Headers": headers_val,
    }
    if is_preflight:
        result["Access-Control-Max-Age"] = str(CORS_MAX_AGE)
        result["Vary"] = "Origin"
    if is_sse:
        result["Vary"] = "Origin"
    return result
