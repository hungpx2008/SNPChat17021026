import hashlib
import math
from functools import lru_cache

from sentence_transformers import SentenceTransformer

from .config import get_settings


@lru_cache(maxsize=1)
def get_embedding_model():
    """
    Tải và cache mô hình embedding.
    Sử dụng lru_cache để đảm bảo mô hình chỉ được tải vào bộ nhớ một lần.
    """
    # Bạn có thể chọn bất kỳ mô hình nào từ Hugging Face Hub
    # 'all-MiniLM-L6-v2' là một lựa chọn tốt, cân bằng giữa tốc độ và chất lượng.
    return SentenceTransformer("all-MiniLM-L6-v2")


def embed_text(text: str) -> list[float]:
    """Tạo embedding cho một đoạn văn bản bằng mô hình SentenceTransformer."""
    settings = get_settings()
    model = get_embedding_model()
    embedding = model.encode(text)

    # Kích thước embedding của 'all-MiniLM-L6-v2' là 384.
    # Đảm bảo giá trị `embedding_dimension` trong config của bạn khớp với mô hình.
    if len(embedding) != settings.embedding_dimension:
        # Có thể thêm logic để xử lý lỗi hoặc điều chỉnh kích thước ở đây nếu cần.
        print(f"Warning: Model dimension {len(embedding)} does not match config dimension {settings.embedding_dimension}.")

    return embedding.tolist()


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
