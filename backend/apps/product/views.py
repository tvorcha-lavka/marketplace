from decimal import Decimal
from json import dumps

from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.functions import Coalesce
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_page
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from core.celery import app

from .filters import ProductPrivateFilter, ProductPublicFilter
from .models import Product, ProductImage
from .pagination import ProductPageNumberPagination
from .permissions import IsProductOwnerOrAdmin
from .serializers import (
    ProductCrateSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ProductPrivateDetailSerializer,
    ProductPrivateListSerializer,
    ProductUpdateSerializer,
)


class ProductPublicViewSet(ReadOnlyModelViewSet):
    pagination_class = ProductPageNumberPagination
    filterset_class = ProductPublicFilter
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            Product.objects.filter(active=True)
            .annotate(seller_rating=Coalesce("owner__reviews__avg_rating", Decimal(0.0)))
            .prefetch_related("original_image", "original_image__processed_images")
            .order_by("-seller_rating", "-date_published")
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
        serializer_class_map = {
            "list": ProductPrivateListSerializer,
            "create": ProductCrateSerializer,
            "update": ProductUpdateSerializer,
        }
        return serializer_class_map.get(self.action)

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            self.permission_classes = [IsAuthenticated, IsProductOwnerOrAdmin]

        return [permission() for permission in self.permission_classes]

    def get_queryset(self):
        return (
            Product.objects.filter(owner_id=self.request.user.pk)
            .prefetch_related("images")
            .select_related("owner")
            .order_by("-draft")
        )

    @extend_schema(request=ProductCrateSerializer)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        app.send_task(
            name="create.db.product",
            queue="database.queue",
            kwargs={
                "user_id": str(self.request.user.pk),
                "session_id": str(serializer.validated_data.pop("session_id")),
                "validated_data": dumps(serializer.validated_data, cls=DjangoJSONEncoder),
            },
        )

        is_draft = {
            True: _("The product has been saved as a draft."),
            False: _("The product will be published in a few minutes."),
        }

        message = is_draft[serializer.validated_data.get("draft", False)]
        return Response({"message": message}, status=status.HTTP_201_CREATED)

    @extend_schema(request=ProductUpdateSerializer, responses=ProductPrivateDetailSerializer)
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        images = serializer.validated_data.pop("images", [])
        filters = serializer.validated_data.pop("filters", [])

        product = serializer.save()
        update_objects = []

        if not images:
            product.images.all().delete()

        for action, obj, priority, temp_image in images:
            if action == "create":
                instance = ProductImage(product=product, priority=priority)
                instance.image_temp = temp_image
                instance.save()

            elif action == "update":
                if obj.priority != priority:
                    obj.priority = priority
                    update_objects.append(obj)

            elif action == "delete":
                obj.delete()

        ProductImage.objects.bulk_update(update_objects, ["priority"]) if update_objects else None

        product.filters.set(filters)
        product.refresh_from_db()

        response_data = ProductPrivateDetailSerializer(product).data
        return Response(response_data, status=status.HTTP_200_OK)
