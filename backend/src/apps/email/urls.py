from django.urls import path
from drf_spectacular.utils import extend_schema

from .views import SendEmailVerificationAPIView, SendPasswordRecoveryAPIView

SchemaTag1, SchemaTag2 = "Send Email", "Password Recovery"
SendEmailVerificationAPIViewExtended = extend_schema(tags=[SchemaTag1])(SendEmailVerificationAPIView)
SendPasswordRecoveryAPIViewExtended = extend_schema(tags=[SchemaTag1, SchemaTag2])(SendPasswordRecoveryAPIView)

urlpatterns = [
    path("email-verification/", SendEmailVerificationAPIViewExtended.as_view(), name="send-email-verification-code"),
    path("password-recovery/", SendPasswordRecoveryAPIViewExtended.as_view(), name="send-password-recovery-code"),
]
