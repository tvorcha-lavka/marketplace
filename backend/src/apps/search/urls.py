from django.urls import path

from .views import SearchPanelView

urlpatterns = [
    path("", SearchPanelView.as_view(), name="search"),
]
