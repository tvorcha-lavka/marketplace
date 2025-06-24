from typing import Iterator, Self

from apps.category.models import Category
from apps.search.elastic.mappings import CATEGORY_INDEX_SETTINGS
from apps.search.elastic.models import TranslatableText, TranslatableTextList

from .base import BaseDocument


class CategoryDocument(BaseDocument[Category]):
    index_settings = CATEGORY_INDEX_SETTINGS
    index_name = "category"
    model = Category

    active: bool
    slug: str
    url: str
    title: TranslatableText
    full_path: TranslatableTextList
    parent_id: int | None

    @classmethod
    def from_orm(cls, category: Category) -> Self:
        """Convert Django model to Document."""
        title = TranslatableText.from_model(model=category, field="title")

        ancestors = category.get_ancestors(include_self=True).order_by("level")
        full_path = TranslatableTextList.from_models(models=ancestors, field="title")

        return cls(
            id=category.pk,
            active=category.active,
            url=category.url,
            slug=category.slug,
            title=title,
            full_path=full_path,
            parent_id=getattr(category.parent, "pk", None),
        )

    @classmethod
    def get_iterator(cls) -> Iterator[Category]:
        """Return queryset iterator."""
        # fmt: off
        return (
            cls.model.objects
            .prefetch_related("translations")
            .iterator(chunk_size=2000)
        )
        # fmt: on
