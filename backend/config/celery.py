from __future__ import absolute_import, unicode_literals

import logging.config
import os

from celery import Celery
from celery.schedules import crontab
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()

environment = os.getenv("MODE", "dev")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", f"config.settings.{environment}")
settings.CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

app = Celery("backend", broker="redis://redis:6379/0", backend="redis://redis:6379/0")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.conf.broker_connection_retry_on_startup = True
app.autodiscover_tasks()

if not settings.DEBUG:
    logging.config.dictConfig(settings.LOGGING)

# Defining loggers
celery_worker_logger = logging.getLogger("celery.worker")
celery_beat_logger = logging.getLogger("celery.beat")

# Exporting loggers
__all__ = ["celery_worker_logger", "celery_beat_logger"]

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

app.conf.task_routes = {
    "apps.user_auth.jwt_auth.tasks.send_password_reset_email": {"queue": "high_priority"},
}

# Defining celery beat schedule
app.conf.beat_schedule = {
    "remove_expired_tokens": {
        "task": "apps.user_auth.jwt_auth.tasks.remove_expired_tokens",
        "schedule": crontab(hour="0", minute="0"),
        "options": {"queue": "low_priority"},
    }
}
