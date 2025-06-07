import os

from celery import Celery
from celery.schedules import crontab

from core.celery.settings import celery_settings
from core.utils import settings_module

# Defining django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

# Defining celery application
app = Celery(celery_settings.APP_NAME)

# Configure celery settings
app.conf.update(
    broker_url=celery_settings.BROKER_URL,
    result_backend=celery_settings.RESULT_BACKEND,
    beat_scheduler="django_celery_beat.schedulers:DatabaseScheduler",
    broker_connection_retry_on_startup=True,
    accept_content=["json"],
    task_serializer="json",
    timezone="UTC",
)

# Configure celery beat schedule
app.conf.beat_schedule = {
    "database.prune.expired.tokens": {
        "task": "apps.user_auth.jwt.tasks.prune_expired_tokens_task",
        "schedule": crontab(hour="0", minute="0"),
        "options": {"queue": "database.queue"},
    }
}

# Register tasks
app.autodiscover_tasks()

# Configure logging  # TODO: configure
# logging.config.dictConfig(logging_settings.configure())
