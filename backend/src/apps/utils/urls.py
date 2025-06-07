from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import RouteListView

RouteListViewExtended = extend_schema(tags=["Routes"])(RouteListView)

urlpatterns = [
    path("", RouteListViewExtended.as_view(), name="route-list"),
]
