from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver

from apps.utils.image import admin_compress_image

from .models import CardImage, CategoryImage


@receiver(pre_save, sender=CategoryImage)
def compress_category_image(sender, instance, **kwargs):  # noqa: F841
    instance.image = admin_compress_image(instance.image, "JPEG")


@receiver(pre_save, sender=CardImage)
def compress_category_card_image(sender, instance, **kwargs):  # noqa: F841
    instance.image = admin_compress_image(instance.image, "PNG")


@receiver(pre_delete, sender=CategoryImage)
def delete_category_image(sender, instance, **kwargs):  # noqa: F841
    instance.image.delete(save=False)


@receiver(pre_delete, sender=CardImage)
def delete_category_card_image(sender, instance, **kwargs):  # noqa: F841
    instance.image.delete(save=False)
