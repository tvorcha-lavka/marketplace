from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import GoogleOAuth2CallbackView, GoogleOAuth2RedirectView

GoogleOAuth2RedirectView = extend_schema(tags=["Google Authentication"])(GoogleOAuth2RedirectView)
GoogleOAuth2CallbackView = extend_schema(tags=["Google Authentication"])(GoogleOAuth2CallbackView)

urlpatterns = [
    path("login/google/", GoogleOAuth2RedirectView.as_view(), name="google-login"),
    path("login/google/complete/", GoogleOAuth2CallbackView.as_view(), name="google-login-complete"),
]
