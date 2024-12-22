from django.utils.decorators import method_decorator
from django.utils.translation import activate
from django.views.decorators.cache import cache_page
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ReadOnlyModelViewSet

from .filters import CategoryFilter
from .models import Category
from .serializers import CatalogSerializer, CategoryDetailSerializer, CategorySerializer


class CategoryReadOnlyViewSet(ReadOnlyModelViewSet):
    serializer_class = CategoryDetailSerializer
    filterset_class = CategoryFilter
    permission_classes = [AllowAny]
    pagination_class = None

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CategoryDetailSerializer
        return CategorySerializer

    def dispatch(self, request, *args, **kwargs):
        activate(request.GET.get("lang", request.LANGUAGE_CODE))
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return (
            Category.objects.filter(active=True)
            .select_related("image", "card", "card__image", "statistics")
            .prefetch_related("translations")
        )

    @method_decorator(cache_page(3600, key_prefix="category-list"))  # server-side cache for 1 hour
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(3600, key_prefix="category-detail"))  # server-side cache for 1 hour
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class CatalogListAPIView(ListAPIView):
    serializer_class = CatalogSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return (
            Category.objects.filter(active=True, level__in=[0, 1, 2])
            .select_related("image")
            .prefetch_related("translations")
            .order_by("level", "order")
        )

    @method_decorator(cache_page(3600, key_prefix="catalog"))  # server-side cache for 1 hour
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
