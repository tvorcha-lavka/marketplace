from django.urls import path
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    LoginAPIView,
    LogoutAPIView,
    PasswordResetAPIView,
    PasswordResetConfirmAPIView,
    SignupAPIView,
    VerifyEmailAPIView,
)

SchemaTag = "JWT Authentication"
LoginAPIView = extend_schema(tags=[SchemaTag])(LoginAPIView)
LogoutAPIView = extend_schema(tags=[SchemaTag])(LogoutAPIView)
SignupAPIView = extend_schema(tags=[SchemaTag], auth=[])(SignupAPIView)
TokenObtainPairView = extend_schema(tags=[SchemaTag])(TokenObtainPairView)
TokenRefreshView = extend_schema(tags=[SchemaTag])(TokenRefreshView)

SchemaTag = "Reset Password"
PasswordResetAPIView = extend_schema(tags=[SchemaTag])(PasswordResetAPIView)
PasswordResetConfirmAPIView = extend_schema(tags=[SchemaTag])(PasswordResetConfirmAPIView)

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("sign-up/", SignupAPIView.as_view(), name="sign-up"),
    path("token/obtain/", TokenObtainPairView.as_view(), name="token-obtain"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("password/reset/", PasswordResetAPIView.as_view(), name="password-reset"),
    path("password/reset/confirm/", PasswordResetConfirmAPIView.as_view(), name="password-reset-confirm"),
    path("verify-email/", VerifyEmailAPIView.as_view(), name="verify-email"),
]
