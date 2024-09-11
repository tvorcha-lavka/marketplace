from django.core.exceptions import ObjectDoesNotExist
from django.utils.decorators import method_decorator
from django.utils.translation import get_language_from_request
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .filters import CategoryFilter
from .models import Category, CategoryStatistics
from .serializers import CategoryDetailSerializer, CategorySerializer


class CategoryViewSet(ModelViewSet):
    serializer_class = CategoryDetailSerializer
    filterset_class = CategoryFilter
    pagination_class = None

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CategoryDetailSerializer
        return CategorySerializer

    def get_queryset(self):
        return (
            Category.objects.filter(active=True)
            .language(get_language_from_request(self.request))
            .select_related("image", "statistics")
            .prefetch_related("translations")
        )

    @method_decorator(cache_page(3600))  # server-side cache for 1 hour
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class UpdateCategoryStatisticAPIView(APIView):
    def get_object(self):
        return get_object_or_404(Category, pk=self.kwargs["pk"])

    def update_statistic(self, *, method: str):
        category = self.get_object()

        try:
            category.statistics
        except ObjectDoesNotExist:
            CategoryStatistics.objects.create(category=category)

        getattr(category.statistics, method)()
        return Response(status=status.HTTP_200_OK)


class UpdateViewsCountAPIView(UpdateCategoryStatisticAPIView):
    """Update view count for the category."""

    def post(self, request, *args, **kwargs):  # noqa: F841
        return self.update_statistic(method="increment_views")


class UpdatePurchasesCountAPIView(UpdateCategoryStatisticAPIView):
    """Update purchases count for the category."""

    def post(self, request, *args, **kwargs):  # noqa: F841
        return self.update_statistic(method="increment_purchases")
