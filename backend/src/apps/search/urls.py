from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import SearchPanelView

SchemaTag = "Search"
SearchPanelViewExtended = extend_schema(tags=[SchemaTag])(SearchPanelView)

urlpatterns = [
    path("", SearchPanelViewExtended.as_view(), name="search"),
]
