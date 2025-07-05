from typing import Any

from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver

from apps.utils.image import admin_compress_image
from core.celery.enums import QueueEnum

from .middleware import CategoryStatisticMiddleware
from .models import CardImage, CategoryImage
from .signals import category_viewed, purchase_in_category
from .tasks import update_category_purchase_task, update_category_views_task


# --- Receivers for compress image -------------------------------------------------------------------------------------
@receiver(pre_save, sender=CategoryImage)
def compress_category_image(sender: CategoryImage, instance: CategoryImage, **kwargs: Any) -> None:  # noqa: F841
    instance.image = admin_compress_image(instance.image, "JPEG")


@receiver(pre_save, sender=CardImage)
def compress_category_card_image(sender: CardImage, instance: CardImage, **kwargs: Any) -> None:  # noqa: F841
    instance.image = admin_compress_image(instance.image, "PNG")


# --- Receivers for delete image ---------------------------------------------------------------------------------------
@receiver(pre_delete, sender=CategoryImage)
def delete_category_image(sender: CategoryImage, instance: CategoryImage, **kwargs: Any) -> None:  # noqa: F841
    instance.image.delete(save=False)


@receiver(pre_delete, sender=CardImage)
def delete_category_card_image(sender: CardImage, instance: CardImage, **kwargs: Any) -> None:  # noqa: F841
    instance.image.delete(save=False)


# --- Receivers to increase category stats -----------------------------------------------------------------------------
@receiver(category_viewed, sender=CategoryStatisticMiddleware)
def handle_category_viewed(sender: CategoryStatisticMiddleware, category_id: int, **kwargs: Any) -> None:  # noqa: F841
    update_category_views_task.apply_async(args=(category_id,), queue=QueueEnum.STATISTICS, priority=10)


@receiver(purchase_in_category)
def handle_category_purchase(sender: Any, category_id: int, **kwargs: Any) -> None:  # noqa: F841
    update_category_purchase_task.apply_async(args=(category_id,), queue=QueueEnum.STATISTICS, priority=10)
