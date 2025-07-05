from datetime import date
from typing import Any
from uuid import UUID

from pydantic import BaseModel
from rest_framework import serializers

from apps.product.images import ImageBundle
from apps.search.elastic.schemas import OwnerSchema


class SearchParamsSerializer(serializers.Serializer[Any]):
    query = serializers.CharField(required=True)


class BaseDocumentSerializer(BaseModel):
    id: UUID | int  # noqa: VNE003


class CategoryDocumentSerializer(BaseDocumentSerializer):
    slug: str
    title: str
    url: str
    full_path: list[str]


class ProductDocumentSerializer(BaseDocumentSerializer):
    title: str
    description: str
    price: float
    is_vip: bool
    date_published: date

    owner: OwnerSchema
    category_id: int
    images: list[ImageBundle]
    full_path: list[str]


class SearchPanelResult(BaseModel):
    query: str
    categories: list[CategoryDocumentSerializer]
    products: list[ProductDocumentSerializer]
