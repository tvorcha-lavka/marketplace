from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from apps.product.models import ProductImage

from .tasks import resize_image_task


@receiver(post_save, sender=ProductImage)
def resize_product_image(sender, instance, **kwargs):  # noqa: F841
    if instance.image_temp:
        image_name = instance.image_temp.name
        image_bytes = instance.image_temp.read()

        resize_image_task.apply_async(
            args=(instance.pk, image_bytes, image_name),
            queue="high_priority",
            priority=10,
        )


@receiver(pre_delete, sender=ProductImage)
def delete_category_image(sender, instance, **kwargs):  # noqa: F841
    # TODO: реализовать удаление изображений через селери
    for size in ["small", "medium", "large"]:
        getattr(instance, f"image_{size}").delete(save=False)
