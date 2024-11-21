from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .filters import ProductFilter
from .models import Product
from .pagination import ProductPageNumberPagination
from .serializers import ProductReadOnlyDetailSerializer, ProductReadOnlyListSerializer


class ProductReadOnlyViewSet(ReadOnlyModelViewSet):
    pagination_class = ProductPageNumberPagination
    filterset_class = ProductFilter
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
            return ProductReadOnlyListSerializer
        return ProductReadOnlyDetailSerializer

    @method_decorator(cache_page(300, key_prefix="products:read-list"))  # server-side cache for 5 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(300, key_prefix="products:read-detail"))  # server-side cache for 5 minutes
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class ProductViewSet(ModelViewSet):
    serializer_class = ProductReadOnlyDetailSerializer  # ProductDetailSerializer
    permission_classes = [IsAuthenticated]  # IsProductOwner, IsAdmin

    def get_queryset(self):
        return Product.objects.filter(active=True)

        # if self.request.user.is_staff:
        #     return Product.objects.all()
        # return Product.objects.filter(owner=self.request.user)


# TODO: Реализация `ProductViewSet`, тут вся остальная бизнес логика с которой будут взаимодействовать клиенты.
#  Нужно уже будет добавить `IsAuthenticated` и `IsProductOwner` пермишены для доступа публикации
#  и редактированию продукта.
