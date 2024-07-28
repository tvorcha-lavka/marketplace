from django.urls import include, path

from .facebook_oauth2 import urls as facebook_oauth2
from .google_oauth2 import urls as google_oauth2
from .jwt_auth import urls as jwt_auth

urlpatterns = [
    path("", include(jwt_auth), name="jwt_auth"),
    path("", include(google_oauth2), name="google_oauth2"),
    path("", include(facebook_oauth2), name="facebook_oauth2"),
]
