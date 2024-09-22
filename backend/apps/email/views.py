from rest_framework import status
from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.response import Response

from apps.email.serializers import EmailSerializer
from apps.email.tasks import send_reset_password, send_verify_email
from apps.user.models import User
from apps.user_auth.jwt.redis import temporary_signup_data_update_timeout


class SendEmailVerificationAPIView(GenericAPIView):
    """Sends a verification email to the user with the provided email address."""

    serializer_class = EmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = User.objects.filter(email=email).first()

        if user and user.is_email_verified:
            return Response({"message": "Email already verified."}, status=status.HTTP_400_BAD_REQUEST)

        result, message = send_verify_email(email)
        temporary_signup_data_update_timeout(email)

        return Response({"message": message}, status=status.HTTP_200_OK)


class SendPasswordResetAPIView(GenericAPIView):
    """Sends a password reset email to the user with the provided email address."""

    serializer_class = EmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = get_object_or_404(User, email=email)
        result, message = send_reset_password(user)

        return Response({"message": message}, status=status.HTTP_200_OK)
