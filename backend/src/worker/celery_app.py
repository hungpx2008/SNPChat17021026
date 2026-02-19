"""
Celery application instance for ChatSNP.
Import this in tasks.py and as the entry point for celery CLI.

Usage:
    celery -A src.worker.celery_app worker -Q chat_priority --loglevel=info
"""
from celery import Celery

celery_app = Celery("chatsnp")

# Load config from src.core.celery_config module
celery_app.config_from_object("src.core.celery_config")

# Auto-discover tasks in src.worker.tasks
celery_app.autodiscover_tasks(["src.worker"])
