from django.core.exceptions import ObjectDoesNotExist
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .filters import CategoryFilter
from .models import BASE_LANGUAGE, Category, CategoryStatistics
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
        return Category.objects.filter(active=True)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        lang = self.request.headers.get("Accept-Language", BASE_LANGUAGE).split(",")[0]
        context["lang"] = self.request.GET.get("lang", lang)
        return context

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
