from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import SellerRateAndReviewAPIView, UserViewSet

SchemaTag = "User"
UserViewSet = extend_schema(tags=[SchemaTag])(UserViewSet)

SchemaTag = "User Reviews"
SellerRateAndReviewAPIView = extend_schema(tags=[SchemaTag])(SellerRateAndReviewAPIView)

list_view = {"get": "list"}
detail_view = {"get": "retrieve", "patch": "partial_update", "delete": "destroy"}

urlpatterns = [
    path("", UserViewSet.as_view(list_view), name="user-list"),
    path("<uuid:pk>/", UserViewSet.as_view(detail_view), name="user-detail"),
    path("<uuid:pk>/reviews/", SellerRateAndReviewAPIView.as_view(), name="user-reviews"),
]
