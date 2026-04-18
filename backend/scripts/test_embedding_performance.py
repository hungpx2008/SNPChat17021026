"""
Test embedding model performance và RAG retrieval quality.

Usage:
    docker compose --env-file .env exec backend python -m scripts.test_embedding_performance

Đánh giá:
1. Model load time + RAM usage
2. Embedding speed (tokens/sec, queries/sec)
3. RAG retrieval quality — test queries về giá
4. Similarity score distribution
"""
import time
import tracemalloc
import os

# ── 1. Settings ──────────────────────────────────────────────────────────────
from src.core.config import get_settings
settings = get_settings()

print("=" * 60)
print(f"  ChatSNP Embedding Performance Test")
print(f"  Model : {settings.embedding_model}")
print(f"  Dim   : {settings.embedding_dimension}")
print("=" * 60)

# ── 2. Model load time + RAM ─────────────────────────────────────────────────
print("\n[1/4] Loading model...")
tracemalloc.start()
t0 = time.time()

from sentence_transformers import SentenceTransformer
model = SentenceTransformer(settings.embedding_model, device="cpu")

load_time = time.time() - t0
current, peak = tracemalloc.get_traced_memory()
tracemalloc.stop()

print(f"  ✓ Load time  : {load_time:.2f}s")
print(f"  ✓ RAM peak   : {peak / 1024 / 1024:.0f} MB")
print(f"  ✓ max_seq_len: {model.max_seq_length}")

# ── 3. Embedding speed ────────────────────────────────────────────────────────
print("\n[2/4] Embedding speed test...")

test_texts = [
    "Giá dịch vụ nâng hạ container 20 feet là bao nhiêu?",
    "Cước phí lưu kho container lạnh tại cảng Cát Lái",
    "Phí THC cho hàng xuất khẩu là bao nhiêu đồng?",
    "Bảng giá dịch vụ cảng năm 2024",
    "Chi phí vận chuyển container từ cảng về kho",
] * 10  # 50 queries

t0 = time.time()
embeddings = model.encode(test_texts, batch_size=16, normalize_embeddings=True, show_progress_bar=False)
elapsed = time.time() - t0

qps = len(test_texts) / elapsed
print(f"  ✓ {len(test_texts)} queries in {elapsed:.2f}s → {qps:.1f} queries/sec")
print(f"  ✓ Embedding dim: {embeddings.shape[1]}")

# ── 4. Qdrant retrieval quality ───────────────────────────────────────────────
print("\n[3/4] Qdrant retrieval quality (port_knowledge collection)...")

try:
    from src.core.qdrant_setup import get_qdrant_client
    client = get_qdrant_client()

    # Check collection info
    info = client.get_collection("port_knowledge")
    total_points = info.points_count
    vector_size = info.config.params.vectors.size
    print(f"  ✓ port_knowledge: {total_points} chunks, vector_size={vector_size}")

    if total_points == 0:
        print("  ⚠ Collection rỗng — cần upload PDF trước khi test retrieval")
    else:
        # Test queries
        test_queries = [
            "giá nâng hạ container 20 feet",
            "phí lưu kho container",
            "cước vận chuyển",
            "bảng giá dịch vụ cảng",
        ]

        print(f"\n  {'Query':<40} {'Top score':>10} {'#results':>8}")
        print(f"  {'-'*40} {'-'*10} {'-'*8}")

        for q in test_queries:
            vec = model.encode(q, normalize_embeddings=True).tolist()
            results = client.query_points(
                collection_name="port_knowledge",
                query=vec,
                limit=5,
                score_threshold=0.0,  # No threshold — show raw scores
            ).points

            top_score = results[0].score if results else 0.0
            above_threshold = sum(1 for r in results if r.score >= 0.35)
            status = "✓" if top_score >= 0.35 else "✗"
            print(f"  {status} {q:<40} {top_score:>10.4f} {above_threshold:>8}/5")

        # Score distribution
        print(f"\n  Score threshold (current): 0.35")
        print(f"  Scores ≥0.35 = retrieved | Scores <0.35 = filtered out")

except Exception as e:
    print(f"  ✗ Qdrant error: {e}")

# ── 5. Summary ────────────────────────────────────────────────────────────────
print("\n[4/4] Summary")
print("=" * 60)
print(f"  Model     : {settings.embedding_model}")
print(f"  Load time : {load_time:.2f}s")
print(f"  RAM peak  : {peak / 1024 / 1024:.0f} MB (model only)")
print(f"  Speed     : {qps:.1f} queries/sec (batch=16, cpu)")
print(f"  max_seq   : {model.max_seq_length} tokens")
chunk_coverage = min(768, model.max_seq_length) / 768 * 100
print(f"  Coverage  : {chunk_coverage:.0f}% of 768-token chunks encoded fully")
print("=" * 60)

if model.max_seq_length >= 768:
    print("  ✓ max_seq ≥ chunk_size — không bị truncate!")
else:
    truncate_pct = (1 - model.max_seq_length / 768) * 100
    print(f"  ✗ max_seq < chunk_size — bị truncate {truncate_pct:.0f}%!")
