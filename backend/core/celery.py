from __future__ import absolute_import, unicode_literals

import logging.config
import os

from celery import Celery
from celery.schedules import crontab
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()

environment = os.getenv("MODE", "dev")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", f"core.settings.{environment}")
settings.CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

broker_url = os.getenv("CELERY_BROKER_URL")
backend_url = os.getenv("CELERY_RESULT_BACKEND", "rpc://")

app = Celery("backend", broker=broker_url, backend=backend_url)
app.config_from_object("django.conf:settings", namespace="CELERY")
app.conf.broker_connection_retry_on_startup = True
app.autodiscover_tasks()

if not settings.DEBUG:
    logging.config.dictConfig(settings.LOGGING)

# Defining loggers
celery_worker_logger = logging.getLogger("celery.worker")
celery_beat_logger = logging.getLogger("celery.beat")

# Exporting loggers
__all__ = ["app", "celery_worker_logger", "celery_beat_logger"]

app.conf.task_queues = {
    "low_priority": {
        "exchange": "low_priority",
        "exchange_type": "direct",
        "routing_key": "low_priority",
    },
    "high_priority": {
        "exchange": "high_priority",
        "exchange_type": "direct",
        "routing_key": "high_priority",
    },
}

# Defining celery beat schedule
app.conf.beat_schedule = {
    "remove_expired_tokens": {
        "task": "apps.user_auth.jwt.tasks.remove_expired_tokens",
        "schedule": crontab(hour="0", minute="0"),
        "options": {"queue": "low_priority"},
    }
}
