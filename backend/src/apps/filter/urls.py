from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import FilterTypeListAPIView

SchemaTag = "Filters"
FilterTypeListAPIViewExtended = extend_schema(tags=[SchemaTag])(FilterTypeListAPIView)

urlpatterns = [
    path("", FilterTypeListAPIViewExtended.as_view(), name="filter-list"),
]
