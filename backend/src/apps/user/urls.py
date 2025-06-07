from typing import TYPE_CHECKING, Any, Union

from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import SellerRateAndReviewAPIView, UserViewSet

if TYPE_CHECKING:
    from rest_framework.decorators import ViewSetAction

    ActionMap = dict[str, Union[str, ViewSetAction[Any]]]


SchemaTag = "User"
UserViewSetExtended = extend_schema(tags=[SchemaTag])(UserViewSet)

SchemaTag = "User Reviews"
SellerRateAndReviewAPIViewExtended = extend_schema(tags=[SchemaTag])(SellerRateAndReviewAPIView)

list_view: "ActionMap" = {"get": "list"}
detail_view: "ActionMap" = {"get": "retrieve", "patch": "partial_update", "delete": "destroy"}

urlpatterns = [
    path("", UserViewSetExtended.as_view(list_view), name="user-list"),
    path("<uuid:pk>/", UserViewSetExtended.as_view(detail_view), name="user-detail"),
    path("<uuid:pk>/reviews/", SellerRateAndReviewAPIViewExtended.as_view(), name="user-reviews"),
]
