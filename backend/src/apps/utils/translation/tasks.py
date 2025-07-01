from typing import cast

from celery import Task
from django.apps import apps
from django.core.cache import caches
from django_redis.cache import RedisCache
from parler.models import TranslatableModel

from core.celery.client import app
from core.celery.enums import QueueEnum


@app.task(name="database.translations.create", queue=QueueEnum.DATABASE, bind=True)
def translate_fields_task(self: Task, app_label: str, instance_pk: int, language_code: str) -> None:
    """Create translations to each field in translatable_fields."""
    lock_key = f"translate_task_lock_{app_label}:{instance_pk}"

    # Trying to capture the lock
    redis_client = cast(RedisCache, caches["default"]).client.get_client()
    if not redis_client.setnx(lock_key, "locked"):
        return

    redis_client.expire(lock_key, 60)

    try:
        # Get a model and an instance
        model = cast(TranslatableModel, apps.get_model(app_label))
        instance = model.objects.get(pk=instance_pk)
        instance.set_current_language(language_code)

        # Translating the fields
        for field_name in instance.get_translated_fields():
            field_value = getattr(instance, field_name)
            instance.translate_field(field_name, field_value) if field_value else None

    except Exception as e:
        raise self.retry(exc=e)

    finally:
        # Releasing the lock after work is completed
        redis_client.delete(lock_key)
