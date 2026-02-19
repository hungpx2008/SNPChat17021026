"""
Celery configuration for ChatSNP workers.
Defines broker, result backend, serializer, and queue routing.
"""
from kombu import Queue

# ---------------------------------------------------------------------------
# Broker & Result Backend
# ---------------------------------------------------------------------------
broker_url = "redis://redis:6379/0"
result_backend = "redis://redis:6379/1"

# ---------------------------------------------------------------------------
# Serialisation
# ---------------------------------------------------------------------------
task_serializer = "json"
result_serializer = "json"
accept_content = ["json"]
timezone = "Asia/Ho_Chi_Minh"
enable_utc = True

# ---------------------------------------------------------------------------
# Queue definitions — 3 queues riêng biệt
# ---------------------------------------------------------------------------
task_queues = (
    Queue("chat_priority", routing_key="chat.#"),
    Queue("data_batch", routing_key="data.#"),
    Queue("media_process", routing_key="media.#"),
)

task_default_queue = "chat_priority"
task_default_routing_key = "chat.default"

# ---------------------------------------------------------------------------
# Task routing — mỗi task gắn cố định vào 1 queue
# ---------------------------------------------------------------------------
task_routes = {
    # 🔴 Chat — real-time, low latency
    "src.worker.tasks.process_chat_response": {"queue": "chat_priority"},
    "src.worker.tasks.store_memory":          {"queue": "chat_priority"},

    # 🟠 Data — SQL queries (Vanna), sync
    "src.worker.tasks.run_sql_query": {"queue": "data_batch"},
    "src.worker.tasks.sync_data":     {"queue": "data_batch"},

    # 🔵 Media — heavy processing (Lida, Docling, TTS)
    "src.worker.tasks.generate_chart":   {"queue": "media_process"},
    "src.worker.tasks.process_document": {"queue": "media_process"},
    "src.worker.tasks.text_to_speech":   {"queue": "media_process"},
}

# ---------------------------------------------------------------------------
# Worker tuning
# ---------------------------------------------------------------------------
worker_prefetch_multiplier = 1          # Lấy 1 task/lần → công bằng giữa workers
task_acks_late = True                   # Ack sau khi xử lý → tránh mất task khi crash
worker_max_tasks_per_child = 100        # Restart worker sau 100 task → chống memory leak
result_expires = 3600                   # Kết quả hết hạn sau 1h
