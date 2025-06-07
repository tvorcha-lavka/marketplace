from typing import Any

from django.urls import get_resolver
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response

from .serializers import RouteSerializer


class RouteListView(RetrieveAPIView[Any]):
    """Return list of all API routes in JSON format."""

    serializer_class = RouteSerializer
    permission_classes = [IsAdminUser]

    @method_decorator(cache_page(3600))  # cache for 1 hour
    def get(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        resolver = get_resolver()
        url_patterns = resolver.reverse_dict
        exclude = ["schema", "docs", "redoc", "route-list"]

        urls = {
            key: "/" + value[0][0][0]  # type: ignore[index]
            for key, value in url_patterns.items()
            if isinstance(key, str) and key not in exclude
        }

        sorted_urls = dict(sorted(urls.items(), key=lambda item: item[1]))
        return Response(sorted_urls, status=status.HTTP_200_OK)
