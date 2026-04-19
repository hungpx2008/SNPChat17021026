"""
Optimized Qdrant operations with batching and retry logic.

Improvements:
1. Batched upsert (100 vectors/batch)
2. Retry logic for network errors
3. Better error handling
4. Progress tracking
"""
import asyncio
import logging
import time
from typing import Any

from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels
from qdrant_client.http.exceptions import UnexpectedResponse

logger = logging.getLogger(__name__)

# Constants
UPSERT_BATCH_SIZE = 100
MAX_RETRIES = 3
RETRY_DELAY_BASE = 2  # seconds


def upsert_vectors_batched(
    client: QdrantClient,
    collection_name: str,
    payloads: list[dict[str, Any]],
    vectors: list[list[float]],
    ids: list[str] | None = None,
    batch_size: int = UPSERT_BATCH_SIZE,
) -> dict[str, Any]:
    """
    Upsert vectors to Qdrant with batching and retry.

    ⚡ OPTIMIZED:
    - Batch processing (100 vectors/batch by default)
    - Exponential backoff retry
    - Progress tracking
    - Better error messages

    Args:
        client: Qdrant client instance
        collection_name: Collection name
        payloads: List of payload dicts
        vectors: List of embedding vectors
        ids: Optional list of IDs (auto-generated if None)
        batch_size: Batch size (default: 100)

    Returns:
        dict with status and stats
    """
    if not payloads or not vectors:
        return {"status": "skipped", "reason": "empty_input"}

    if len(payloads) != len(vectors):
        raise ValueError(f"Payloads ({len(payloads)}) and vectors ({len(vectors)}) length mismatch")

    # Generate IDs if not provided
    if ids is None:
        from uuid import uuid4
        ids = [str(uuid4()) for _ in range(len(vectors))]

    total_vectors = len(vectors)
    batches_count = (total_vectors + batch_size - 1) // batch_size
    successful_batches = 0
    failed_batches = 0
    total_retries = 0

    logger.info(
        f"[qdrant] Upserting {total_vectors} vectors to '{collection_name}' "
        f"in {batches_count} batches (batch_size={batch_size})"
    )

    start_time = time.perf_counter()

    for batch_idx in range(batches_count):
        start = batch_idx * batch_size
        end = min(start + batch_size, total_vectors)

        batch_payloads = payloads[start:end]
        batch_vectors = vectors[start:end]
        batch_ids = ids[start:end]

        # Build points for this batch
        points = [
            qmodels.PointStruct(
                id=point_id,
                vector=vector,
                payload=payload,
            )
            for point_id, vector, payload in zip(batch_ids, batch_vectors, batch_payloads)
        ]

        # Retry logic
        for attempt in range(MAX_RETRIES):
            try:
                client.upsert(
                    collection_name=collection_name,
                    points=points,
                    wait=True,  # Wait for operation to complete
                )
                successful_batches += 1
                logger.debug(
                    f"[qdrant] Batch {batch_idx + 1}/{batches_count} upserted "
                    f"({len(points)} vectors)"
                )
                break

            except UnexpectedResponse as e:
                total_retries += 1
                if attempt == MAX_RETRIES - 1:
                    # Last attempt failed
                    failed_batches += 1
                    logger.error(
                        f"[qdrant] Batch {batch_idx + 1}/{batches_count} FAILED after "
                        f"{MAX_RETRIES} attempts: {e}"
                    )
                    raise
                else:
                    # Retry with exponential backoff
                    delay = RETRY_DELAY_BASE ** attempt
                    logger.warning(
                        f"[qdrant] Batch {batch_idx + 1}/{batches_count} failed "
                        f"(attempt {attempt + 1}/{MAX_RETRIES}), "
                        f"retrying in {delay}s: {e}"
                    )
                    time.sleep(delay)

            except Exception as e:
                failed_batches += 1
                logger.error(
                    f"[qdrant] Batch {batch_idx + 1}/{batches_count} FAILED "
                    f"with unexpected error: {e}"
                )
                raise

    elapsed = time.perf_counter() - start_time
    throughput = total_vectors / elapsed if elapsed > 0 else 0

    logger.info(
        f"[qdrant] Upsert complete: {successful_batches}/{batches_count} batches successful, "
        f"{failed_batches} failed, {total_retries} retries, "
        f"{elapsed:.2f}s ({throughput:.0f} vectors/sec)"
    )

    return {
        "status": "success" if failed_batches == 0 else "partial",
        "total_vectors": total_vectors,
        "successful_batches": successful_batches,
        "failed_batches": failed_batches,
        "total_retries": total_retries,
        "elapsed_seconds": elapsed,
        "throughput_vectors_per_sec": throughput,
    }


async def upsert_vectors_batched_async(
    client: QdrantClient,
    collection_name: str,
    payloads: list[dict[str, Any]],
    vectors: list[list[float]],
    ids: list[str] | None = None,
    batch_size: int = UPSERT_BATCH_SIZE,
) -> dict[str, Any]:
    """
    Async version of upsert_vectors_batched.

    Runs in thread pool to avoid blocking event loop.
    """
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
        None,
        upsert_vectors_batched,
        client,
        collection_name,
        payloads,
        vectors,
        ids,
        batch_size,
    )


def delete_by_filter_safe(
    client: QdrantClient,
    collection_name: str,
    filter_conditions: qmodels.Filter,
    max_retries: int = MAX_RETRIES,
) -> dict[str, Any]:
    """
    Delete vectors by filter with retry logic.

    Args:
        client: Qdrant client
        collection_name: Collection name
        filter_conditions: Filter object
        max_retries: Max retry attempts

    Returns:
        dict with status
    """
    for attempt in range(max_retries):
        try:
            result = client.delete(
                collection_name=collection_name,
                points_selector=qmodels.FilterSelector(filter=filter_conditions),
                wait=True,
            )
            logger.info(f"[qdrant] Deleted vectors from '{collection_name}' with filter")
            return {"status": "success", "result": result}

        except UnexpectedResponse as e:
            if attempt == max_retries - 1:
                logger.error(f"[qdrant] Delete FAILED after {max_retries} attempts: {e}")
                raise
            delay = RETRY_DELAY_BASE ** attempt
            logger.warning(
                f"[qdrant] Delete failed (attempt {attempt + 1}/{max_retries}), "
                f"retrying in {delay}s: {e}"
            )
            time.sleep(delay)

        except Exception as e:
            logger.error(f"[qdrant] Delete FAILED with unexpected error: {e}")
            raise

    return {"status": "error", "reason": "max_retries_exceeded"}
