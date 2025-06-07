from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import GoogleOAuth2CallbackView, GoogleOAuth2RedirectView

SchemaTag = "Google Authentication"
GoogleOAuth2RedirectViewExtended = extend_schema(tags=[SchemaTag])(GoogleOAuth2RedirectView)
GoogleOAuth2CallbackViewExtended = extend_schema(tags=[SchemaTag])(GoogleOAuth2CallbackView)

urlpatterns = [
    path("login/google/", GoogleOAuth2RedirectViewExtended.as_view(), name="google-login"),
    path("login/google/complete/", GoogleOAuth2CallbackViewExtended.as_view(), name="google-login-complete"),
]
