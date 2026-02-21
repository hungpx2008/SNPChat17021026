"""
Celery task definitions for ChatSNP.

Re-exports all tasks from split modules so existing import paths work unchanged.

3 Queues:
  - chat_priority : process_chat_response, store_memory, rag_document_search, process_feedback
  - data_batch    : run_sql_query, sync_data
  - media_process : generate_chart, process_document, text_to_speech
"""

# Re-export all tasks so `from src.worker.tasks import X` keeps working
from .chat_tasks import (  # noqa: F401
    process_chat_response,
    store_memory,
    rag_document_search,
    process_feedback,
    summarize_session_history,
)
from .data_tasks import (  # noqa: F401
    run_sql_query,
    sync_data,
)
from .media_tasks import (  # noqa: F401
    analyze_document,
    process_document_with_engine,
    generate_chart,
    process_document,
    text_to_speech,
)
from .gardener_tasks import (  # noqa: F401
    consolidate_memories,
)
