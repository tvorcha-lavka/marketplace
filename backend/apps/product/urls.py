from django.urls import include, path
from drf_spectacular.utils import extend_schema
from rest_framework.routers import DefaultRouter

from apps.product.views import ProductAPIView

SchemaTag = "Product"
ProductAPIView = extend_schema(tags=[SchemaTag])(ProductAPIView)

router = DefaultRouter()
router.register(r"", ProductAPIView, basename="product")

urlpatterns = [
    path("", include(router.urls)),
]
