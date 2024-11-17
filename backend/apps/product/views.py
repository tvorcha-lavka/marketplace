from rest_framework.viewsets import ModelViewSet

from apps.product.models import Product, ProductImage
from apps.product.serializers import ProductImageSerializer, ProductSerializer


class ProductAPIView(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        return Product.objects.prefetch_related(
            "image", "filters", "filters__translations", "filters__filter_type", "filters__filter_type__translations"
        ).order_by("pk")


class ProductImageAPIView(ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer


# TODO: `ProductAPIView` переименуем в `ProductReadOnlyViewSet` и переделать соответственно под `ReadOnlyModelViewSet`.
#  `ProductReadOnlyViewSet` будет иметь два стандартных url `GET /api/products/` и `GET /api/products/<pk>/`.

# TODO: В атрибутах класса `ProductReadOnlyViewSet` нужно будет добавить `filterset_class = ProductFilter`
#  `ProductFilter` - это класс фильтрации продуктов, который наследуется от класса FilterSet.

# TODO: В `ProductFilter` реализовать такие поля фильтрации:
#  `seller` - фильтрация по id юзера - /api/products/?seller=1
#  `category` - фильтрация по id категории - /api/products/?category=1
#  `filters_in` - фильтрация по id's модели FilterValue через запятую - /api/products/?filters_in=1,2,3,4,5

# TODO: `ProductSerializer` переименуем в `ProductListSerializer`. Его будем использовать на старание с товарами.
#  `ProductListSerializer` должен иметь только id, name, price, date_published, is_vip.

# TODO: Реализация `ProductDetailSerializer`. Его будем использовать на станице с одним товаром.
#  Наследуем поля от `ProductListSerializer` и добавляем остальные.

# TODO: В `ProductReadOnlyViewSet` через метод get_serializer_class и self.action
#  определяем какой будет использоваться сериализатор `ProductListSerializer` или `ProductDetailSerializer`.

# TODO: Реализация `ProductViewSet`, тут вся остальная бизнес логика с которой будут взаимодействовать клиенты.
#  Нужно уже будет добавить `IsAuthenticated` пермишен.

# TODO: Для `ProductReadOnlyViewSet` и `ProductViewSet`:
#  В методе `get_queryset` не забываем фильтровать за параметром `active=True`

# TODO: Отказываемся от DefaultRouter в urls.py и прописываем логику вручную, для более явного управления url.
