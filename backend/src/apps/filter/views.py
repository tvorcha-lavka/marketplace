from typing import Any

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from .filters import FilterTypeFilter
from .models import FilterType
from .serializers import FilterTypeSerializer


class FilterTypeListAPIView(ListAPIView[FilterType]):
    queryset = FilterType.objects.all()
    serializer_class = FilterTypeSerializer
    filterset_class = FilterTypeFilter
    permission_classes = [AllowAny]
    pagination_class = None

    @method_decorator(cache_page(3600, key_prefix="filters"))  # server-side cache for 1 hour
    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        return super().list(request, *args, **kwargs)
