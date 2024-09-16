from django.urls import path
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    LoginAPIView,
    LogoutAPIView,
    PasswordResetAPIView,
    SendEmailVerificationAPIView,
    SendPasswordResetAPIView,
    SignupAPIView,
    VerifyCodeAPIView,
    VerifyEmailAddressAPIView,
)

SchemaTag = "JWT Authentication"
LoginAPIView = extend_schema(tags=[SchemaTag])(LoginAPIView)
LogoutAPIView = extend_schema(tags=[SchemaTag])(LogoutAPIView)
SignupAPIView = extend_schema(tags=[SchemaTag], auth=[])(SignupAPIView)

SchemaTag = "JWT Token Obtain Pair"
TokenObtainPairView = extend_schema(tags=[SchemaTag])(TokenObtainPairView)
TokenRefreshView = extend_schema(tags=[SchemaTag])(TokenRefreshView)

SchemaTag = "Verification"
VerifyCodeAPIView = extend_schema(tags=[SchemaTag])(VerifyCodeAPIView)
VerifyEmailAddressAPIView = extend_schema(tags=[SchemaTag])(VerifyEmailAddressAPIView)

SchemaTag1, SchemaTag2 = "Reset Password", "Send Email"
SendEmailVerificationAPIView = extend_schema(tags=[SchemaTag2])(SendEmailVerificationAPIView)
SendPasswordResetAPIView = extend_schema(tags=[SchemaTag1, SchemaTag2])(SendPasswordResetAPIView)
PasswordResetAPIView = extend_schema(tags=[SchemaTag1])(PasswordResetAPIView)

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("sign-up/", SignupAPIView.as_view(), name="sign-up"),
    # ------------------------------------------------------------------------
    path("token/obtain/", TokenObtainPairView.as_view(), name="token-obtain"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    # -----------------------------------------------------------------------------------------------------------------
    path("send-mail/email-verification/", SendEmailVerificationAPIView.as_view(), name="send-email-verification-code"),
    path("send-mail/reset-password/", SendPasswordResetAPIView.as_view(), name="send-reset-password-code"),
    # --------------------------------------------------------------------------------------
    path("verify-email/", VerifyEmailAddressAPIView.as_view(), name="verify-email-address"),
    path("verify-code/", VerifyCodeAPIView.as_view(), name="verify-code"),
    # -----------------------------------------------------------------------------
    path("reset/password/", PasswordResetAPIView.as_view(), name="reset-password"),
]
