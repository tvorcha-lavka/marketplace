from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import CategoryViewSet, UpdatePurchasesCountAPIView, UpdateViewsCountAPIView

SchemaTag = "Category"
CategoryViewSet = extend_schema(tags=[SchemaTag])(CategoryViewSet)

SchemaTag = "Category Statistics"
UpdateViewsCountAPIView = extend_schema(tags=[SchemaTag])(UpdateViewsCountAPIView)
UpdatePurchasesCountAPIView = extend_schema(tags=[SchemaTag])(UpdatePurchasesCountAPIView)

urlpatterns = [
    path("", CategoryViewSet.as_view({"get": "list"}), name="category-list"),
    path("<int:pk>/", CategoryViewSet.as_view({"get": "retrieve"}), name="category-detail"),
    path("<int:pk>/update-views/", UpdateViewsCountAPIView.as_view(), name="update-category-views"),
    path("<int:pk>/update-purchases/", UpdatePurchasesCountAPIView.as_view(), name="update-category-purchases"),
]
