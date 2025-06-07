from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import SendEmailVerificationAPIView, SendPasswordResetAPIView

SchemaTag1, SchemaTag2 = "Send Email", "Reset Password"
SendEmailVerificationAPIViewExtended = extend_schema(tags=[SchemaTag1])(SendEmailVerificationAPIView)
SendPasswordResetAPIViewExtended = extend_schema(tags=[SchemaTag1, SchemaTag2])(SendPasswordResetAPIView)

urlpatterns = [
    path("email-verification/", SendEmailVerificationAPIViewExtended.as_view(), name="send-email-verification-code"),
    path("reset-password/", SendPasswordResetAPIViewExtended.as_view(), name="send-reset-password-code"),
]
