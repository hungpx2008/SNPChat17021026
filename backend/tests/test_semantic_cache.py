"""Tests for SemanticCache — Redis-backed hybrid search result caching."""

import hashlib
import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from src.services.search.semantic_cache import (
    CACHE_KEY_PREFIX,
    CACHE_TTL_SECONDS,
    SemanticCache,
)


# ── Fixtures ────────────────────────────────────────────────────────────


@pytest.fixture
def mock_redis():
    """Create a mock async Redis client."""
    redis = AsyncMock()
    return redis


@pytest.fixture
def cache(mock_redis):
    """Create a SemanticCache with mocked Redis."""
    with patch("src.services.search.semantic_cache.get_redis", return_value=mock_redis):
        c = SemanticCache()
    return c


# ── Normalize tests ────────────────────────────────────────────────────


class TestNormalize:
    """Tests for _normalize() static method."""

    def test_lowercase_and_strip(self):
        """Should lowercase and strip whitespace."""
        assert SemanticCache._normalize("  Hello World  ") == "hello world"

    def test_collapse_whitespace(self):
        """Should collapse multiple whitespace into single space."""
        assert SemanticCache._normalize("hello   world\t\nfoo") == "hello world foo"

    def test_vietnamese_diacritics_removed(self):
        """Should remove Vietnamese diacritics for cache matching."""
        # "biểu giá" → "bieu gia"
        result = SemanticCache._normalize("Biểu giá dịch vụ")
        assert result == "bieu gia dich vu"

    def test_vietnamese_complex_diacritics(self):
        """Should handle all Vietnamese tone marks and special chars."""
        # ắ = a + breve + acute, ồ = o + circumflex + grave
        result = SemanticCache._normalize("Tân Cảng Sài Gòn")
        assert result == "tan cang sai gon"

    def test_empty_string(self):
        """Should handle empty string gracefully."""
        assert SemanticCache._normalize("") == ""

    def test_already_ascii(self):
        """ASCII text should pass through unchanged (lowered)."""
        assert SemanticCache._normalize("container 20ft") == "container 20ft"


# ── Key generation tests ───────────────────────────────────────────────


class TestMakeKey:
    """Tests for _make_key() static method."""

    def test_key_with_user_id(self):
        """Key should include user_id as scope."""
        key = SemanticCache._make_key("test query", user_id="user123")
        assert key.startswith(f"{CACHE_KEY_PREFIX}:user123:")
        # Hash portion should be sha256
        parts = key.split(":")
        assert len(parts) == 3
        assert len(parts[2]) == 64  # sha256 hex length

    def test_key_without_user_id(self):
        """Key should use 'global' scope when no user_id."""
        key = SemanticCache._make_key("test query", user_id=None)
        assert key.startswith(f"{CACHE_KEY_PREFIX}:global:")

    def test_key_deterministic(self):
        """Same query + user_id should always produce the same key."""
        key1 = SemanticCache._make_key("biểu giá container", user_id="u1")
        key2 = SemanticCache._make_key("biểu giá container", user_id="u1")
        assert key1 == key2

    def test_key_normalization_equivalence(self):
        """Queries that normalize to the same string should produce the same key."""
        key1 = SemanticCache._make_key("Biểu Giá", user_id=None)
        key2 = SemanticCache._make_key("  biểu   giá  ", user_id=None)
        assert key1 == key2

    def test_different_queries_different_keys(self):
        """Different queries should produce different keys."""
        key1 = SemanticCache._make_key("query A", user_id=None)
        key2 = SemanticCache._make_key("query B", user_id=None)
        assert key1 != key2

    def test_key_hash_is_sha256(self):
        """The hash in the key should be a valid sha256 of the normalized query."""
        query = "test query"
        normalized = SemanticCache._normalize(query)
        expected_hash = hashlib.sha256(normalized.encode("utf-8")).hexdigest()
        key = SemanticCache._make_key(query, user_id=None)
        assert key == f"{CACHE_KEY_PREFIX}:global:{expected_hash}"


# ── Cache get() tests ──────────────────────────────────────────────────


class TestCacheGet:
    """Tests for get() method."""

    @pytest.mark.asyncio
    async def test_cache_miss_returns_none(self, cache, mock_redis):
        """Should return None on cache miss."""
        mock_redis.get.return_value = None
        result = await cache.get("unknown query")
        assert result is None

    @pytest.mark.asyncio
    async def test_cache_hit_returns_deserialized(self, cache, mock_redis):
        """Should return deserialized JSON on cache hit."""
        expected = [{"doc_id": "d1", "title": "Test", "score": 0.95}]
        mock_redis.get.return_value = json.dumps(expected)

        result = await cache.get("some query", user_id="u1")

        assert result == expected
        mock_redis.get.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_redis_error_returns_none(self, cache, mock_redis):
        """Redis errors should not crash — return None gracefully."""
        mock_redis.get.side_effect = ConnectionError("Redis down")

        result = await cache.get("any query")

        assert result is None  # Graceful degradation


# ── Cache put() tests ──────────────────────────────────────────────────


class TestCachePut:
    """Tests for put() method."""

    @pytest.mark.asyncio
    async def test_put_stores_json_with_ttl(self, cache, mock_redis):
        """Should store JSON-serialized results with correct TTL."""
        results = [{"doc_id": "d1", "content": "hello"}]

        await cache.put("my query", results, user_id="u1")

        mock_redis.set.assert_called_once()
        call_args = mock_redis.set.call_args
        # Positional: key, payload
        key_arg = call_args[0][0]
        payload_arg = call_args[0][1]
        # Keyword: ex=TTL
        assert call_args[1]["ex"] == CACHE_TTL_SECONDS

        # Payload should be valid JSON matching input
        assert json.loads(payload_arg) == results
        # Key should start with cache prefix
        assert key_arg.startswith(f"{CACHE_KEY_PREFIX}:u1:")

    @pytest.mark.asyncio
    async def test_put_custom_ttl(self, mock_redis):
        """Should respect custom TTL passed to constructor."""
        with patch("src.services.search.semantic_cache.get_redis", return_value=mock_redis):
            c = SemanticCache(ttl=60)

        await c.put("q", [{"doc_id": "1"}])

        call_args = mock_redis.set.call_args
        assert call_args[1]["ex"] == 60

    @pytest.mark.asyncio
    async def test_put_redis_error_does_not_crash(self, cache, mock_redis):
        """Redis errors on put should log warning, not raise."""
        mock_redis.set.side_effect = ConnectionError("Redis down")

        # Should NOT raise
        await cache.put("query", [{"doc_id": "1"}])

    @pytest.mark.asyncio
    async def test_put_global_scope_when_no_user(self, cache, mock_redis):
        """Should use 'global' scope when user_id is None."""
        await cache.put("q", [{"doc_id": "1"}], user_id=None)

        call_args = mock_redis.set.call_args
        key_arg = call_args[0][0]
        assert ":global:" in key_arg


# ── Cache invalidate() tests ──────────────────────────────────────────


class TestCacheInvalidate:
    """Tests for invalidate() method."""

    @pytest.mark.asyncio
    async def test_invalidate_user_scans_and_deletes(self, cache, mock_redis):
        """Should SCAN for user-scoped keys and delete them."""
        # Simulate SCAN returning keys then ending
        mock_redis.scan.return_value = ("0", ["scache:u1:abc", "scache:u1:def"])
        mock_redis.delete.return_value = 2

        deleted = await cache.invalidate(user_id="u1")

        assert deleted == 2
        mock_redis.scan.assert_called_once_with(
            cursor="0", match=f"{CACHE_KEY_PREFIX}:u1:*", count=100
        )
        mock_redis.delete.assert_called_once_with("scache:u1:abc", "scache:u1:def")

    @pytest.mark.asyncio
    async def test_invalidate_all_uses_wildcard_pattern(self, cache, mock_redis):
        """Should use scache:* pattern when no user_id."""
        mock_redis.scan.return_value = ("0", ["scache:global:abc"])
        mock_redis.delete.return_value = 1

        deleted = await cache.invalidate(user_id=None)

        assert deleted == 1
        mock_redis.scan.assert_called_once_with(
            cursor="0", match=f"{CACHE_KEY_PREFIX}:*", count=100
        )

    @pytest.mark.asyncio
    async def test_invalidate_no_keys_found(self, cache, mock_redis):
        """Should return 0 when no matching keys exist."""
        mock_redis.scan.return_value = ("0", [])

        deleted = await cache.invalidate(user_id="empty_user")

        assert deleted == 0
        mock_redis.delete.assert_not_called()

    @pytest.mark.asyncio
    async def test_invalidate_redis_error_returns_zero(self, cache, mock_redis):
        """Redis errors during invalidation should not crash."""
        mock_redis.scan.side_effect = ConnectionError("Redis down")

        deleted = await cache.invalidate(user_id="u1")

        assert deleted == 0

    @pytest.mark.asyncio
    async def test_invalidate_multi_page_scan(self, cache, mock_redis):
        """Should iterate through SCAN pages until cursor returns 0."""
        # First page: cursor=42, keys=[k1]
        # Second page: cursor=0, keys=[k2]
        mock_redis.scan.side_effect = [
            ("42", ["scache:u1:aaa"]),
            ("0", ["scache:u1:bbb"]),
        ]
        mock_redis.delete.return_value = 1

        deleted = await cache.invalidate(user_id="u1")

        assert deleted == 2
        assert mock_redis.scan.call_count == 2
        assert mock_redis.delete.call_count == 2


# ── Round-trip integration test ────────────────────────────────────────


class TestRoundTrip:
    """Verify put → get round-trip with mocked Redis."""

    @pytest.mark.asyncio
    async def test_put_then_get_roundtrip(self, mock_redis):
        """Values stored by put() should be retrievable by get()."""
        store = {}

        async def fake_set(key, value, ex=None):
            store[key] = value

        async def fake_get(key):
            return store.get(key)

        mock_redis.set = fake_set
        mock_redis.get = fake_get

        with patch("src.services.search.semantic_cache.get_redis", return_value=mock_redis):
            c = SemanticCache()

        original = [{"doc_id": "d1", "title": "Biểu giá", "score": 0.9}]
        await c.put("biểu giá container", original, user_id="u1")

        # Same query should hit
        result = await c.get("biểu giá container", user_id="u1")
        assert result == original

        # Normalized-equivalent query should also hit
        result2 = await c.get("  Biểu   Giá   Container  ", user_id="u1")
        assert result2 == original
