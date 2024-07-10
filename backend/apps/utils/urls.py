from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import RouteListView

RouteListView = extend_schema(tags=["Routes"])(RouteListView)

urlpatterns = [
    path("", RouteListView.as_view(), name="route-list"),
]
