from rest_framework.viewsets import ModelViewSet

from apps.product.models import Product, ProductImage
from apps.product.serializers import ProductImageSerializer, ProductSerializer


class ProductAPIView(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        return Product.objects.prefetch_related(
            "image", "filters", "translations", "filters__translations", "filters__filter_type"
        )


class ProductImageAPIView(ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
