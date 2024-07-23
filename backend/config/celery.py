from __future__ import absolute_import, unicode_literals

import logging.config
import os
from datetime import timedelta

from celery import Celery
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

# Defining celery beat schedule
app.conf.beat_schedule = {
    "clean_blacklist": {"task": "apps.user_auth.jwt_auth.tasks.clean_blacklist", "schedule": timedelta(days=1)},
}
