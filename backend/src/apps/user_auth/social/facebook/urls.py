from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import FacebookOAuth2CallbackView, FacebookOAuth2RedirectView

SchemaTag = "Facebook Authentication"
FacebookOAuth2RedirectViewExtended = extend_schema(tags=[SchemaTag])(FacebookOAuth2RedirectView)
FacebookOAuth2CallbackViewExtended = extend_schema(tags=[SchemaTag])(FacebookOAuth2CallbackView)

urlpatterns = [
    path("login/facebook/", FacebookOAuth2RedirectViewExtended.as_view(), name="facebook-login"),
    path("login/facebook/complete/", FacebookOAuth2CallbackViewExtended.as_view(), name="facebook-login-complete"),
]
