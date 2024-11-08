from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver

from apps.utils.image import admin_compress_image

from .models import CardImage, CategoryImage
from .signals import category_viewed, purchase_in_category
from .tasks import update_category_purchase, update_category_views


# --- Receivers for compress image -------------------------------------------------------------------------------------
@receiver(pre_save, sender=CategoryImage)
def compress_category_image(sender, instance, **kwargs):  # noqa: F841
    instance.image = admin_compress_image(instance.image, "JPEG")


@receiver(pre_save, sender=CardImage)
def compress_category_card_image(sender, instance, **kwargs):  # noqa: F841
    instance.image = admin_compress_image(instance.image, "PNG")


# --- Receivers for delete image ---------------------------------------------------------------------------------------
@receiver(pre_delete, sender=CategoryImage)
def delete_category_image(sender, instance, **kwargs):  # noqa: F841
    instance.image.delete(save=False)


@receiver(pre_delete, sender=CardImage)
def delete_category_card_image(sender, instance, **kwargs):  # noqa: F841
    instance.image.delete(save=False)


# --- Receivers to increase category stats -----------------------------------------------------------------------------
@receiver(category_viewed)
def handle_category_viewed(sender, category_id, **kwargs):  # noqa: F841
    update_category_views.apply_async(args=(category_id,), queue="low_priority", priority=10)


@receiver(purchase_in_category)
def handle_category_purchase(sender, category_id, **kwargs):  # noqa: F841
    update_category_purchase.apply_async(args=(category_id,), queue="low_priority", priority=10)
