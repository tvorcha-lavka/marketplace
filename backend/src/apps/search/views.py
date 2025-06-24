from typing import Any

from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from core.elasticsearch.client import elastic

from .elastic.documents import CategoryDocument, ProductDocument
from .elastic.query import ElasticMultiSearchBuilder
from .serializers import SearchPanelResult, SearchParamsSerializer


@extend_schema(parameters=[OpenApiParameter(name="query", type=str, required=True)])
class SearchPanelView(GenericAPIView[Any]):

    serializer_class = SearchParamsSerializer
    permission_classes = [AllowAny]

    @extend_schema(request=SearchParamsSerializer, responses=SearchPanelResult)
    def get(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """
        Search categories and products matching the search query
        and return grouped results.
        """
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        builder = ElasticMultiSearchBuilder(request=request)
        builder.add(
            index="category",
            fields=[],
            translatable_fields=["title^2", "full_path"],
            collapse_field="title",
            size=5,
        )
        builder.add(
            index="product",
            fields=["title^4", "description^2"],
            translatable_fields=["full_path^3"],
            nested_translatable_fields=["filters.value^5"],
            collapse_field="title",
            size=5,
        )
        response = elastic.msearch(body=builder.body)

        category_hits = response["responses"][0]["hits"]["hits"]
        product_hits = response["responses"][1]["hits"]["hits"]

        data = SearchPanelResult(
            query=builder.query,
            categories=CategoryDocument.serialize_from_hits(category_hits),
            products=ProductDocument.serialize_from_hits(product_hits),
        )
        return Response(data.model_dump(), status=status.HTTP_200_OK)
