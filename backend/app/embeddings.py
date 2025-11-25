import hashlib
import math

from .config import get_settings


def mock_embed(text: str) -> list[float]:
    """Deterministic embedding based on SHA256 hash buckets."""
    settings = get_settings()
    length = settings.embedding_dimension
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    floats: list[float] = []
    for i in range(length):
        chunk = digest[i % len(digest)]
        value = (chunk / 255.0) * 2 - 1  # scale to [-1, 1]
        floats.append(value)

    norm = math.sqrt(sum(v * v for v in floats)) or 1.0
    return [v / norm for v in floats]
