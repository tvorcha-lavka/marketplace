from django.urls import include, path
from drf_spectacular.utils import extend_schema

from .jwt import urls as jwt_auth
from .social import urls as social_auth
from .views import ResetPasswordAPIView, VerifyCodeAPIView

SchemaTag = "Verification"
VerifyCodeAPIView = extend_schema(tags=[SchemaTag])(VerifyCodeAPIView)

SchemaTag = "Reset Password"
ResetPasswordAPIView = extend_schema(tags=[SchemaTag])(ResetPasswordAPIView)

urlpatterns = [
    path("", include(jwt_auth), name="jwt-auth"),
    path("", include(social_auth), name="social-auth"),
    # --------------------------------------------------------------------
    path("verify-code/", VerifyCodeAPIView.as_view(), name="verify-code"),
    # -----------------------------------------------------------------------------
    path("reset/password/", ResetPasswordAPIView.as_view(), name="reset-password"),
]
