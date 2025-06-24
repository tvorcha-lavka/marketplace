from datetime import date
from typing import Iterator, Self
from uuid import UUID

from pydantic import BaseModel

from apps.product.models import Product
from apps.search.elastic.mappings import PRODUCT_INDEX_SETTINGS
from apps.search.elastic.models import TranslatableText, TranslatableTextList

from .base import BaseDocument


class Owner(BaseModel):
    id: UUID  # noqa: VNE003
    public_username: str


class ProcessedImage(BaseModel):
    url_path: str
    height: int
    width: int


class Image(BaseModel):
    id: UUID  # noqa: VNE003
    url_path: str
    processed: list[ProcessedImage]


class FiltersDocument(BaseModel):
    # index_settings = {}
    # index_name = "filter"
    # model = FilterValue

    type_id: int
    type: str  # noqa: VNE003
    value_id: int
    value: TranslatableText

    # @classmethod
    # def from_orm(cls, filter_value: FilterValue) -> Self:
    #     return cls(
    #         id=filter_value.id,
    #     )


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
    date_published: date | None

    owner: Owner
    category_id: int
    images: list[Image]
    filters: list[FiltersDocument]
    full_path: TranslatableTextList

    @classmethod
    def from_orm(cls, product: Product) -> Self:
        """Convert Django model to Document."""
        owner = Owner(
            id=product.owner.pk,
            public_username=str(product.owner),
        )

        images = [
            Image(
                id=image.pk,
                url_path=image.image.name,
                processed=[
                    ProcessedImage(
                        url_path=p_image.image.name,
                        height=p_image.height,
                        width=p_image.width,
                    )
                    for p_image in image.processed_images.all()
                ],
            )
            for image in product.original_image.all()
        ]

        filters = [
            FiltersDocument(
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
                "original_image",
                "original_image__processed_images",
            )
            .iterator(chunk_size=2000)
        )
