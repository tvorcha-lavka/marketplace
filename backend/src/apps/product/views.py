from decimal import Decimal
from json import dumps
from typing import TYPE_CHECKING, Any

from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import QuerySet
from django.db.models.functions import Coalesce
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_page
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from uuid6 import uuid7

from core.celery.client import app

from .filters import ProductPrivateFilter, ProductPublicFilter
from .models import Product
from .pagination import ProductPageNumberPagination
from .permissions import IsProductOwnerOrAdmin
from .serializers import (
    ProductCrateSerializer,
    ProductCreateResponseSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ProductPrivateDetailSerializer,
    ProductPrivateListSerializer,
    ProductUpdateSerializer,
)

if TYPE_CHECKING:  # pragma: no cover
    from rest_framework.permissions import _SupportsHasPermission


class ProductPublicViewSet(ReadOnlyModelViewSet[Product]):
    pagination_class = ProductPageNumberPagination
    filterset_class = ProductPublicFilter
    permission_classes = [AllowAny]

    def get_queryset(self) -> QuerySet[Product]:
        return (
            Product.objects.filter(active=True)
            .annotate(seller_rating=Coalesce("owner__reviews__avg_rating", Decimal(0.0)))
            .prefetch_related("original_image", "original_image__processed_images")
            .order_by("-seller_rating", "-date_published")
            .select_related("owner")
        )

    def get_serializer_class(self) -> type[ModelSerializer[Product]]:
        if self.action == "list":
            return ProductListSerializer
        return ProductDetailSerializer

    @method_decorator(cache_page(300, key_prefix="products:read-list"))  # server-side cache for 5 minutes
    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(300, key_prefix="products:read-detail"))  # server-side cache for 5 minutes
    def retrieve(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        return super().retrieve(request, *args, **kwargs)


class ProductPrivateViewSet(ModelViewSet[Product]):
    pagination_class = ProductPageNumberPagination
    filterset_class = ProductPrivateFilter

    def get_serializer_class(self) -> type[ModelSerializer[Product]]:
        serializer_class_map = {
            "list": ProductPrivateListSerializer,
            "create": ProductCrateSerializer,
            "update": ProductUpdateSerializer,
        }
        return serializer_class_map[self.action]

    def get_permissions(self) -> list["_SupportsHasPermission"]:
        if self.action in ["update", "partial_update", "destroy"]:
            self.permission_classes = [IsAuthenticated, IsProductOwnerOrAdmin]

        return [permission() for permission in self.permission_classes]

    def get_queryset(self) -> QuerySet[Product]:
        return (
            Product.objects.filter(owner_id=self.request.user.pk)
            .prefetch_related("images")
            .select_related("owner")
            .order_by("-draft")
        )

    @extend_schema(request=ProductCrateSerializer, responses=ProductCreateResponseSerializer)
    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = uuid7()
        serializer.validated_data["id"] = product_id

        app.send_task(
            name="database.product.create",
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

        data = {"product_id": product_id, "message": message}
        response_data = ProductCreateResponseSerializer(data).data
        return Response(response_data, status=status.HTTP_201_CREATED)

    @extend_schema(request=ProductUpdateSerializer, responses=ProductPrivateDetailSerializer)
    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        # TODO: implement update method of Product
        # instance = self.get_object()
        # serializer = self.get_serializer(instance, data=request.data)
        # serializer.is_valid(raise_exception=True)
        #
        # images = serializer.validated_data.pop("images", [])
        # filters = serializer.validated_data.pop("filters", [])
        #
        # product = serializer.save()
        # update_objects = []
        #
        # if not images:
        #     product.images.all().delete()
        #
        # for action, obj, priority, temp_image in images:
        #     if action == "create":
        #         instance = ProductImage(product=product, priority=priority)
        #         instance.image_temp = temp_image  # type: ignore[attr-defined]
        #         instance.save()
        #
        #     elif action == "update":
        #         if obj.priority != priority:
        #             obj.priority = priority
        #             update_objects.append(obj)
        #
        #     elif action == "delete":
        #         obj.delete()
        #
        # ProductImage.objects.bulk_update(update_objects, ["priority"]) if update_objects else None
        #
        # product.filters.set(filters)
        # product.refresh_from_db()
        #
        # response_data = ProductPrivateDetailSerializer(product).data
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)
