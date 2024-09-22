from django.urls import include, path
from drf_spectacular.utils import extend_schema

from .jwt import urls as jwt_auth
from .social import urls as social_auth
from .views import ResetPasswordAPIView

SchemaTag1 = "Reset Password"
ResetPasswordAPIView = extend_schema(tags=[SchemaTag1])(ResetPasswordAPIView)

urlpatterns = [
    path("", include(jwt_auth), name="jwt-auth"),
    path("", include(social_auth), name="social-auth"),
    # -----------------------------------------------------------------------------
    path("reset/password/", ResetPasswordAPIView.as_view(), name="reset-password"),
]
