import os

from django.urls import get_resolver
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from .serializers import RouteSerializer


class RouteListView(ListAPIView):
    """Return list of all API routes."""

    serializer_class = RouteSerializer

    @method_decorator(cache_page(3600))  # cache for 1 hour
    def get(self, _request):
        resolver = get_resolver()
        url_patterns = resolver.reverse_dict.items()
        exclude = ["schema", "docs", "redoc", "route-list"]

        urls = [
            {"reverse_name": key, "url": os.getenv("API_URL") + value[0][0][0]}
            for key, value in url_patterns
            if isinstance(key, str) and key not in exclude
        ]
        serializer = self.serializer_class(urls, many=True)
        return Response(serializer.data)
