from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from apps.product.filters import ProductFilter
from apps.product.models import Product
from apps.product.serializers import ProductDetailSerializer, ProductListSerializer


class ProductReadOnlyViewSet(ReadOnlyModelViewSet):
    filterset_class = ProductFilter
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Product.objects.filter(active=True).prefetch_related("image")

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        return ProductDetailSerializer


class ProductViewSet(ModelViewSet):
    serializer_class = ProductDetailSerializer
    permission_classes = [IsAuthenticated]  # IsProductOwner, IsAdmin

    def get_queryset(self):
        return Product.objects.filter(active=True)

        # if self.request.user.is_staff:
        #     return Product.objects.all()
        # return Product.objects.filter(owner=self.request.user)


# TODO: Реализация `ProductViewSet`, тут вся остальная бизнес логика с которой будут взаимодействовать клиенты.
#  Нужно уже будет добавить `IsAuthenticated` и `IsProductOwner` пермишены для доступа публикации
#  и редактированию продукта.
