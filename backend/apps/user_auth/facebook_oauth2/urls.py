from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import FacebookOAuth2CallbackView, FacebookOAuth2RedirectView

FacebookOAuth2Redirect = extend_schema(tags=["Facebook Authentication"])(FacebookOAuth2RedirectView)
FacebookOAuth2CallbackView = extend_schema(tags=["Facebook Authentication"])(FacebookOAuth2CallbackView)

urlpatterns = [
    path("login/facebook/", FacebookOAuth2Redirect.as_view(), name="facebook-login"),
    path("login/facebook/complete/", FacebookOAuth2CallbackView.as_view(), name="facebook-login-complete"),
]
