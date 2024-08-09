from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import CategoryDetailAPIView, CategoryListAPIView

SchemaTag = "Category"
CategoryListAPIView = extend_schema(tags=[SchemaTag])(CategoryListAPIView)
CategoryDetailAPIView = extend_schema(tags=[SchemaTag])(CategoryDetailAPIView)

urlpatterns = [
    path("", CategoryListAPIView.as_view(), name="category-list"),
    path("<int:pk>", CategoryDetailAPIView.as_view(), name="category-detail"),
]
