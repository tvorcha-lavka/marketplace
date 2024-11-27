from django.urls import path
from drf_spectacular.utils import extend_schema

from apps.product.views import ProductReadOnlyViewSet, ProductViewSet

SchemaTag = "Product"
ProductViewSet = extend_schema(tags=[SchemaTag])(ProductViewSet)
ProductReadOnlyViewSet = extend_schema(tags=[SchemaTag])(ProductReadOnlyViewSet)

product_readonly_list = ProductReadOnlyViewSet.as_view({"get": "list"})
product_readonly_detail = ProductReadOnlyViewSet.as_view({"get": "retrieve"})

product_viewset_create = ProductViewSet.as_view({"post": "create"})
product_viewset_update = ProductViewSet.as_view({"patch": "partial_update"})
product_viewset_delete = ProductViewSet.as_view({"delete": "destroy"})

urlpatterns = [
    path("", product_readonly_list, name="product-list"),
    path("<uuid:pk>/", product_readonly_detail, name="product-detail"),
    # path("create/", product_viewset_create, name="product-create"),
    # path("<uuid:pk>/update/", product_viewset_update, name="product-update"),
    # path("<uuid:pk>/delete/", product_viewset_delete, name="product-delete"),
]
