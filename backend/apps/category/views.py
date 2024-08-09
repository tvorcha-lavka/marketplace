from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.generics import ListAPIView, RetrieveAPIView

from .models import Category
from .serializers import CategoryDetailSerializer, CategorySerializer


class CategoryListAPIView(ListAPIView):
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        subcategories = "__".join(["subcategories"] * 5)
        return Category.objects.prefetch_related(subcategories).filter(parents=None, active=True)

    @method_decorator(cache_page(3600))  # cache for 1 hour
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class CategoryDetailAPIView(RetrieveAPIView):
    serializer_class = CategoryDetailSerializer

    def get_queryset(self):
        return Category.objects.filter(active=True)

    @method_decorator(cache_page(3600))  # cache for 1 hour
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
