from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from apps.product.models import ProductImage

from .tasks import remove_images_task, resize_image_task


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


@receiver(post_delete, sender=ProductImage)
def delete_category_image(sender, instance, **kwargs):  # noqa: F841
    sizes = ["small", "medium", "large"]
    images_to_delete = [getattr(instance, f"image_{size}").name for size in sizes]

    remove_images_task.apply_async(
        args=(images_to_delete,),
        queue="low_priority",
        priority=10,
    )
