from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import CatalogListAPIView, CategoryReadOnlyViewSet

SchemaTag = "Category"
CategoryReadOnlyViewSet = extend_schema(tags=[SchemaTag], auth=[])(CategoryReadOnlyViewSet)
CatalogListAPIView = extend_schema(tags=[SchemaTag], auth=[])(CatalogListAPIView)

urlpatterns = [
    path("", CategoryReadOnlyViewSet.as_view({"get": "list"}), name="category-list"),
    path("<int:pk>/", CategoryReadOnlyViewSet.as_view({"get": "retrieve"}), name="category-detail"),
    path("catalog/", CatalogListAPIView.as_view(), name="catalog-list"),
]
