from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import GoogleOAuth2Redirect, GoogleOAuth2TokenView

GoogleOAuth2Redirect = extend_schema(tags=["Google Authentication"])(GoogleOAuth2Redirect)
GoogleOAuth2TokenView = extend_schema(tags=["Google Authentication"])(GoogleOAuth2TokenView)

urlpatterns = [
    path("login/google-oauth2/", GoogleOAuth2Redirect.as_view(), name="google-oauth2-login"),
    path("complete/google-oauth2/", GoogleOAuth2TokenView.as_view(), name="google-oauth2-complete"),
]
