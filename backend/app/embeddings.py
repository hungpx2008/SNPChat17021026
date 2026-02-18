import hashlib
import math
import httpx
from .config import get_settings

_client = None

def get_client():
    global _client
    if _client is None:
        _client = httpx.AsyncClient(timeout=60.0)
    return _client

async def embed_text(text: str) -> list[float]:
    """
    Tạo embedding bằng cách gọi sang Mem0 Service trung tâm qua REST API.
    """
    settings = get_settings()
    client = get_client()
    try:
        response = await client.post(
            f"{settings.mem0_url.rstrip('/')}/embed",
            json={"text": text}
        )
        response.raise_for_status()
        data = response.json()
        embedding = data["vector"]
        
        # Kiểm tra kích thước vector trả về
        if len(embedding) != settings.embedding_dimension:
            print(f"Warning: Mem0 vector dim {len(embedding)} != config {settings.embedding_dimension}")
            
        return embedding
    except Exception as e:
        print(f"Error calling Mem0 embedding service: {e}")
        # Trong trường hợp service chết hoàn toàn, có thể dùng mock_embed 
        # nhưng tốt nhất là để raise để báo hiệu sự cố hạ tầng.
        raise


def mock_embed(text: str) -> list[float]:
    """
    Deterministic, lightweight embedding used for development and tests.
    Matches configured embedding_dimension to stay compatible with Qdrant setup.
    """
    settings = get_settings()
    dim = settings.embedding_dimension
    if dim <= 0:
        dim = 8
    vector = [0.0] * dim
    if not text:
        return vector

    tokens = text.split()
    for index, token in enumerate(tokens):
        # Hash each token to spread signal across dimensions.
        digest = hashlib.sha256(token.encode("utf-8")).hexdigest()
        value = int(digest[:8], 16) / float(0xFFFFFFFF)
        bucket = index % dim
        vector[bucket] += value

    # Normalize to unit length to mimic cosine-based embeddings.
    norm = math.sqrt(sum(x * x for x in vector)) or 1.0
    return [x / norm for x in vector]
