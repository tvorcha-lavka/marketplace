from celery import shared_task
from django.core.files.storage import default_storage

from apps.product.choices import ProductImageSize
from apps.utils.image.utils import resize_image

from .models import ProductImage


@shared_task
def resize_image_task(instance_pk: int, image_bytes: bytes, image_name: str):
    instance = ProductImage.objects.get(pk=instance_pk)

    for size in ["small", "medium", "large"]:
        dimensions = getattr(ProductImageSize, size.upper()).value
        resized_image = resize_image(image_bytes, image_name, *dimensions)
        setattr(instance, f"image_{size}", resized_image)

    super(ProductImage, instance).save()


@shared_task
def remove_images_task(file_names: list[str]):
    [default_storage.delete(file_name) for file_name in file_names]
