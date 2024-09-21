from rest_framework import status
from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.response import Response

from apps.email.serializers import EmailSerializer
from apps.email.tasks import send_reset_password, send_verify_email
from apps.user.models import User


class EmailAPIView(GenericAPIView):
    """Sends a code to email to the user with the provided email address."""

    serializer_class = EmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(User, email=serializer.validated_data["email"])

        result, message = self.perform_action(user)
        return Response({"message": message}, status=status.HTTP_200_OK)

    def perform_action(self, user: User):
        raise NotImplementedError


class SendEmailVerificationAPIView(EmailAPIView):
    """Sends a verification email to the user with the provided email address."""

    def perform_action(self, user):
        return send_verify_email(user)


class SendPasswordResetAPIView(EmailAPIView):
    """Sends a password reset email to the user with the provided email address."""

    def perform_action(self, user):
        return send_reset_password(user)
