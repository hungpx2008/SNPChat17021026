
import httpx
from src.core.config import get_settings

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
        logging.getLogger(__name__).exception(f"Error calling Mem0 embedding service: {e}")
        # Trong trường hợp service chết hoàn toàn, có thể dùng mock_embed 
        # nhưng tốt nhất là để raise để báo hiệu sự cố hạ tầng.
        raise
