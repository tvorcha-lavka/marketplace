from django.urls import include, path
from drf_spectacular.utils import extend_schema

from .jwt import urls as jwt_auth
from .social import urls as social_auth
from .views import PasswordRecoveryAPIView, VerifyCodeAPIView

SchemaTag = "Verification"
VerifyCodeAPIViewExtended = extend_schema(tags=[SchemaTag])(VerifyCodeAPIView)

SchemaTag = "Password Recovery"
PasswordRecoveryAPIViewExtended = extend_schema(tags=[SchemaTag])(PasswordRecoveryAPIView)

urlpatterns = [
    path("", include(jwt_auth), name="jwt-auth"),
    path("", include(social_auth), name="social-auth"),
    # --------------------------------------------------------------------
    path("verify-code/", VerifyCodeAPIViewExtended.as_view(), name="verify-code"),
    # -----------------------------------------------------------------------------
    path("password/recovery/", PasswordRecoveryAPIViewExtended.as_view(), name="password-recovery"),
]
