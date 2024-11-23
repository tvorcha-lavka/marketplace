from django.urls import path
from drf_spectacular.utils import extend_schema

from apps.product.views import ProductPrivateViewSet, ProductPublicViewSet

SchemaTag = "Product"
ProductPublicViewSet = extend_schema(tags=[SchemaTag])(ProductPublicViewSet)
ProductPrivateViewSet = extend_schema(tags=[SchemaTag])(ProductPrivateViewSet)

product_public_list = ProductPublicViewSet.as_view({"get": "list"})
product_public_detail = ProductPublicViewSet.as_view({"get": "retrieve"})

product_private_list = ProductPrivateViewSet.as_view({"get": "list"})
product_private_create = ProductPrivateViewSet.as_view({"post": "create"})
product_private_update = ProductPrivateViewSet.as_view({"patch": "partial_update"})
product_private_delete = ProductPrivateViewSet.as_view({"delete": "destroy"})

urlpatterns = [
    path("", product_public_list, name="product-list"),
    path("my/", product_private_list, name="my-product-list"),
    path("<uuid:pk>/", product_public_detail, name="product-detail"),
    path("manage/create/", product_private_create, name="product-create"),
    # path("manage/<uuid:pk>/update/", product_private_update, name="product-update"),
    path("manage/<uuid:pk>/delete/", product_private_delete, name="product-delete"),
]
