from celery import shared_task
from django.apps import apps
from django.core.cache import caches

from .utils import user_compress_image

redis_client = caches["default"].client.get_client()


@shared_task
def user_compress_image_task(app_label: str, model_name: str, instance_pk: str, field_name: str, quality: int = 60):
    lock_key = f"compress_task_lock_{instance_pk}_{field_name}"

    lock_acquired = redis_client.setnx(lock_key, "locked")
    if not lock_acquired:
        return

    redis_client.expire(lock_key, 60)

    try:
        model = apps.get_model(app_label, model_name)
        instance = model.objects.get(pk=instance_pk)

        image_field = getattr(instance, field_name)
        if not image_field:
            return

        compress_image = user_compress_image(image_field)

        image_field.save(compress_image.name, compress_image, save=True)

    finally:
        redis_client.delete(lock_key)
