from __future__ import annotations

import httpx

# Global shared HTTP clients to avoid recreating connection pools per request
_sync_client: httpx.Client | None = None
_async_client: httpx.AsyncClient | None = None

# Default timeout — large enough to cover LLM calls (60s)
_DEFAULT_TIMEOUT: float = 60.0


def get_http_client(timeout: float = _DEFAULT_TIMEOUT) -> httpx.Client:
    """Get the shared sync HTTP client with connection pooling.

    Note: timeout is only applied on first initialization.
    The client is reused across all calls for connection pool efficiency.
    """
    global _sync_client  # noqa: PLW0603
    if _sync_client is None:
        _sync_client = httpx.Client(
            timeout=timeout,
            limits=httpx.Limits(
                max_keepalive_connections=20,
                max_connections=100,
                keepalive_expiry=30.0,
            ),
        )
    return _sync_client


def get_async_http_client(timeout: float = _DEFAULT_TIMEOUT) -> httpx.AsyncClient:
    """Get the shared async HTTP client with connection pooling.

    Note: timeout is only applied on first initialization.
    """
    global _async_client  # noqa: PLW0603
    if _async_client is None:
        _async_client = httpx.AsyncClient(
            timeout=timeout,
            limits=httpx.Limits(
                max_keepalive_connections=20,
                max_connections=100,
                keepalive_expiry=30.0,
            ),
        )
    return _async_client


async def aclose_clients() -> None:
    """Gracefully close global clients on shutdown."""
    global _sync_client, _async_client
    if _sync_client:
        _sync_client.close()
        _sync_client = None
    if _async_client:
        await _async_client.aclose()
        _async_client = None
