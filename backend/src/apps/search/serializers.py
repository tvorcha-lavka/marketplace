from collections import defaultdict
from datetime import datetime
from functools import cached_property
from typing import Annotated, Any, Literal, Self
from unicodedata import normalize
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator
from rest_framework import serializers

from apps.product.images import ImageBundle
from apps.search.elastic.schemas import OwnerSchema


class SearchParamsSerializer(serializers.Serializer[Any]):
    query = serializers.CharField(required=True)


class BaseSearchSerializer(BaseModel):
    id: int  # noqa: VNE003
    score: float
    exact_match: bool = False
    type: Literal["category", "product"]  # noqa: VNE003
    title: str

    filter_ids: list[int] = Field(
        default_factory=list,
        alias="filters",
        serialization_alias="filter_ids",
    )
    full_path: list[str]

    model_config = ConfigDict(
        validate_by_name=True,
        validate_by_alias=True,
    )


class CategorySearchResult(BaseSearchSerializer):
    type: Literal["category"] = "category"  # noqa: VNE003
    slug: str
    url_path: str = Field(alias="url", serialization_alias="url_path")


class ProductSearchResult(BaseSearchSerializer):
    id: int = Field(alias="category_id", serialization_alias="id")  # noqa: VNE003
    product_id: UUID = Field(alias="id", serialization_alias="product_id")
    type: Literal["product"] = "product"  # noqa: VNE003


class ProductDetailSearchResult(ProductSearchResult):
    description: str
    price: float
    is_vip: bool
    date_published: datetime

    owner: OwnerSchema
    images: list[ImageBundle]


_SearchResult = Annotated[CategorySearchResult | ProductSearchResult, Field(discriminator="type")]


class SearchPanelResult(BaseModel):
    """
    Represents combined search results for the search panel
    with categories and products sorted by exact match and score.
    """

    query: str
    results: list[_SearchResult] = Field(default_factory=list)

    categories: list[CategorySearchResult] = Field(exclude=True)
    products: list[ProductSearchResult] = Field(exclude=True)

    @cached_property
    def normalized_query(self) -> str:
        """Return normalized query."""
        return self.normalize(self.query)

    @staticmethod
    def normalize(text: str) -> str:
        """Normalize text to lowercase and remove diacritics."""
        return normalize("NFKC", text).strip().lower()

    @model_validator(mode="after")
    def prepare_results(self) -> Self:
        """
        Post-processing of search results:
        - Aggregates filter IDs from products and attaches them to matching categories.
        - Merges categories and products into a unified result list.
        - Sets `exact_match=True` for results whose title exactly matches the normalized query.
        - Sorts results: exact matches appear first, then others by descending score.
        """
        filters: dict[int, set[int]] = defaultdict(set)

        # Aggregate filter IDs
        for product in self.products:
            filters[product.id] |= set(product.filter_ids)

        for category in self.categories:
            category.filter_ids = list(filters[category.id])

        # Merge categories and products
        self.results = self.categories + self.products

        # Set exact match
        for result in self.results:
            result.exact_match = self.is_exact_match(result.title)

        # Sort results
        self.results.sort(key=lambda x: (not x.exact_match, -x.score))

        return self

    def is_exact_match(self, title: str) -> bool:
        return self.normalized_query == self.normalize(title)
