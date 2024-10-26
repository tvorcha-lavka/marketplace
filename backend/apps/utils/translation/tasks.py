from celery import shared_task
from django.apps import apps
from django.core.cache import caches

redis_client = caches["default"].client.get_client()


@shared_task
def translate_fields_task(app_label: str, instance_pk: int, language_code: str):
    """Create translations to each field in translatable_fields."""
    lock_key = f"translate_task_lock_{instance_pk}"

    # Trying to capture the lock
    lock_acquired = redis_client.setnx(lock_key, "locked")
    if not lock_acquired:
        return

    redis_client.expire(lock_key, 60)

    try:
        # Get a model and an instance
        model = apps.get_model(app_label)
        instance = model.objects.get(pk=instance_pk)
        instance.set_current_language(language_code)

        # Translating the fields
        for field_name in instance.get_translated_fields():
            field_value = getattr(instance, field_name)
            instance.translate_field(field_name, field_value) if field_value else None

    finally:
        # Releasing the lock after work is completed
        redis_client.delete(lock_key)
