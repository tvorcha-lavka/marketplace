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
            Product.objects.filter(owner=self.request.user)
            .prefetch_related("images")
            .select_related("owner")
            .order_by("-draft")
        )

    @extend_schema(request=ProductCrateSerializer, responses=ProductPrivateDetailSerializer)
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

    @extend_schema(request=ProductUpdateSerializer, responses=ProductPrivateDetailSerializer)
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        # TODO: Реализовать обновление продукта.
        #  Метод PATCH поменял на PUT, чтобы контролировать полный набор обновления,
        #  так как если будет передаваться пустой список изображений и фильтров,
        #  мы будем засчитывать это как удаление данных.
        #  -
        #  Frontend будет загружать на backend изображения с S3 как будто это новые изображения.
        #  Изображения будут `image_small` + новые пользовательские (если будут).
        #  Нужен будет в сериалайзер `ProductUpdateSerializer`, который будет наследоваться от
        #  `ProductCrateSerializer` и переопределять `validate_images`.
        #  -
        #  Метод `validate_images` должен будет получать изображения из текущего instance и сравнивать изображения
        #  из новой полученной пачки. Тут я думаю нужно будет немного магии и как итог вернуть:
        #  list[tuple[int, bool, TemporaryUploadedFile]] - список из tuple в котором:
        #   `int` - это новая позиция изображения в списке
        #   `bool` - передаем True/False (новый файл требующий оптимизации / была только поменяна позиция в списке)
        #   `TemporaryUploadedFile` - это новый или уже существующий файл
        #  -
        #  После пройденной валидации возвращаемся в эту функцию и уже проводим правильное сохранение.
        #  -
        #  Учесть что каждое сохранение ProductImage запускает сигнал. Там где нужно будет обновить только позицию,
        #  используем конструкцию `super(ProductImage, instance).save(force_update=True, update_fields=["priority"])`

        return Response({"detail": "all ok!"}, status=status.HTTP_200_OK)
