from datetime import datetime
from typing import Any, Iterator, Self

from apps.product.models import Product
from apps.search.elastic.mappings import PRODUCT_INDEX_SETTINGS
from apps.search.elastic.models import TranslatableText, TranslatableTextList
from apps.search.elastic.schemas import FiltersSchema, ImageSchema, OwnerSchema

from .base import BaseDocument


class ProductDocument(BaseDocument[Product]):
    index_settings = PRODUCT_INDEX_SETTINGS
    index_name = "product"
    model = Product

    title: str
    description: str
    price: float
    quantity: int
    active: bool
    draft: bool
    is_vip: bool
    date_published: datetime | None

    owner: OwnerSchema
    category_id: int
    images: list[ImageSchema]
    filters: list[FiltersSchema]
    full_path: TranslatableTextList

    @classmethod
    def from_orm(cls, product: Product) -> Self:
        """Convert Django model to Document."""
        owner = OwnerSchema.model_validate(product.owner)
        images = [ImageSchema.model_validate(image) for image in product.images.all()]

        filters = [
            FiltersSchema(
                type_id=FilterValue.filter_type.pk,
                type=FilterValue.filter_type.slug,
                value_id=FilterValue.pk,
                value=TranslatableText.from_model(model=FilterValue, field="value"),
            )
            for FilterValue in product.filters.all()
        ]

        ancestors = product.category.get_ancestors(include_self=True).order_by("level")
        full_path = TranslatableTextList.from_models(models=ancestors, field="title")

        return cls(
            id=product.pk,
            title=product.title,
            description=product.description,
            price=float(product.price),
            quantity=product.quantity,
            active=product.active,
            draft=product.draft,
            is_vip=product.is_vip,
            date_published=product.date_published,
            category_id=product.category.pk,
            full_path=full_path,
            owner=owner,
            images=images,
            filters=filters,
        )

    @classmethod
    def get_iterator(cls) -> Iterator[Product]:
        """Return queryset iterator."""
        return (
            cls.model.objects.select_related("owner", "category")
            .prefetch_related(
                "category__translations",
                "filters",
                "filters__translations",
                "filters__filter_type",
                "filters__filter_type__translations",
                "images",
            )
            .iterator(chunk_size=2000)
        )

    def model_serialize(self, *args: Any, **kwargs: Any) -> dict[str, Any]:
        """Convert Document to dict for serialization."""
        data = super().model_serialize(*args, **kwargs)

        for key, value in data.items():
            field = self.model_fields[key]

            if field.annotation == list[ImageSchema]:
                data[key] = ImageSchema.multi_model_serialize(value, product_id=str(self.id))

        return data
