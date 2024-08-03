from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import UserViewSet

SchemaTag = "User"
UserViewSet = extend_schema(tags=[SchemaTag])(UserViewSet)

list_view = {"get": "list"}
detail_view = {"get": "retrieve", "patch": "partial_update", "delete": "destroy"}

urlpatterns = [
    path("", UserViewSet.as_view(list_view), name="user-list"),
    path("<int:user_id>/", UserViewSet.as_view(detail_view), name="user-detail"),
]
