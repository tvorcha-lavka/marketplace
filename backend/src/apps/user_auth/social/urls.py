from django.urls import include, path

from .facebook import urls as facebook_urls
from .google import urls as google_urls

urlpatterns = [
    path("", include(facebook_urls), name="facebook"),
    path("", include(google_urls), name="google"),
]
