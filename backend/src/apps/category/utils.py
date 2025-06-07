from typing import TYPE_CHECKING

if TYPE_CHECKING:  # pragma: no cover
    from .models import CardImage, CategoryImage


def category_images_upload_to(instance: "CategoryImage", filename: str) -> str:
    folder_name = instance.category.slug
    return f"category/{folder_name}/{filename}"


def category_card_images_upload_to(instance: "CardImage", filename: str) -> str:
    folder_name = instance.card.category.slug
    return f"category/{folder_name}/card/{filename}"
