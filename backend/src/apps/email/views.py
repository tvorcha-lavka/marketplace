from typing import Any

from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from apps.user.models import User
from apps.user_auth.jwt.redis import temporary_signup_data_update_timeout

from .notifications import notify_user_password_recovery, notify_user_verify_email
from .serializers import EmailSerializer


class SendEmailVerificationAPIView(GenericAPIView[Any]):
    """Sends a verification email to the user with the provided email address."""

    serializer_class = EmailSerializer
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = User.objects.filter(email=email).first()

        if user and user.is_email_verified:
            return Response({"message": _("Email already verified.")}, status=status.HTTP_400_BAD_REQUEST)

        message = notify_user_verify_email(email)
        temporary_signup_data_update_timeout(email)

        return Response({"email": email, "message": message}, status=status.HTTP_200_OK)


class SendPasswordRecoveryAPIView(GenericAPIView[Any]):
    """Sends a password recovery email to the user with the provided email address."""

    serializer_class = EmailSerializer
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = get_object_or_404(User, email=email)
        message = notify_user_password_recovery(user.email)

        return Response({"email": email, "message": message}, status=status.HTTP_200_OK)
