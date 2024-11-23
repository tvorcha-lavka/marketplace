from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .filters import ProductPrivateFilter, ProductPublicFilter
from .models import Product, ProductImage
from .pagination import ProductPageNumberPagination
from .permissions import IsProductOwnerOrAdmin
from .serializers import (
    ProductDetailSerializer,
    ProductEditSerializer,
    ProductListSerializer,
    ProductPrivateDetailSerializer,
    ProductPrivateListSerializer,
)


class ProductPublicViewSet(ReadOnlyModelViewSet):
    pagination_class = ProductPageNumberPagination
    filterset_class = ProductPublicFilter
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            Product.objects.filter(active=True)
            .order_by("-date_published")  # TODO: order_by("-owner__rating")
            .prefetch_related("images")
            .select_related("owner")
        )

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        return ProductDetailSerializer

    @method_decorator(cache_page(300, key_prefix="products:read-list"))  # server-side cache for 5 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(300, key_prefix="products:read-detail"))  # server-side cache for 5 minutes
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class ProductPrivateViewSet(ModelViewSet):
    pagination_class = ProductPageNumberPagination
    filterset_class = ProductPrivateFilter

    def get_serializer_class(self):
        if self.action == "list":
            return ProductPrivateListSerializer
        return ProductEditSerializer

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            self.permission_classes = [IsAuthenticated, IsProductOwnerOrAdmin]

        return [permission() for permission in self.permission_classes]

    def get_queryset(self):
        return (
            Product.objects.filter(owner=self.request.user)
            .prefetch_related("images")
            .select_related("owner")
            .order_by("-draft")
        )

    @extend_schema(request=ProductEditSerializer, responses=ProductPrivateDetailSerializer)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        images = serializer.validated_data.pop("images", [])
        filters = serializer.validated_data.pop("filters", [])

        product = serializer.save(owner=self.request.user)

        for index, image in enumerate(images, start=1):
            instance = ProductImage(product=product, priority=index)
            instance.image_temp = image
            instance.save()

        if filters:
            product.filters.set(filters)

        if images or filters:
            product.refresh_from_db()

        response_data = ProductPrivateDetailSerializer(product).data
        return Response(response_data, status=status.HTTP_201_CREATED)

    @extend_schema(request=ProductEditSerializer, responses=ProductPrivateDetailSerializer)
    def update(self, request, *args, **kwargs):
        # TODO: Реализовать обновление продукта.
        #  Возможно понадобиться в изображения вшивать и проверять EXIF данные о том что объект уже загружен,
        #  чтобы предотвратить повторного сохранения уже и так существующего изображения
        pass
