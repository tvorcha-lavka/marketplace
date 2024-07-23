import os

from django.urls import get_resolver
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response

from .serializers import RouteSerializer


class RouteListView(RetrieveAPIView):
    """Return list of all API routes in JSON format."""

    serializer_class = RouteSerializer

    @method_decorator(cache_page(3600))  # cache for 1 hour
    def get(self, request, *args, **kwargs):
        resolver = get_resolver()
        url_patterns = resolver.reverse_dict.items()
        exclude = ["schema", "docs", "redoc", "route-list"]

        urls = {
            key: os.getenv("API_URL") + value[0][0][0]
            for key, value in url_patterns
            if isinstance(key, str) and key not in exclude
        }

        return Response(urls)
