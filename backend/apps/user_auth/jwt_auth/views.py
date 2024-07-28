from rest_framework import status
from rest_framework.generics import CreateAPIView, get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenBlacklistView, TokenObtainPairView

from apps.user.models import User
from apps.user_auth.helpers import get_token_pair
from apps.user_auth.serializers import PasswordResetConfirmSerializer, PasswordResetSerializer, SignupSerializer

from .tasks import send_password_reset_email


class SignupAPIView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = SignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token_pair = get_token_pair(user)

        response_data = {"user": serializer.data, **token_pair}
        return Response(response_data, status=status.HTTP_201_CREATED)


class LoginAPIView(TokenObtainPairView):
    permission_classes = [AllowAny]


class LogoutAPIView(TokenBlacklistView):
    permission_classes = [AllowAny]


class PasswordResetAPIView(APIView):
    """
    Request a password reset email.
    Sends a password reset email to the user with the provided email address.
    """

    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(User, email=serializer.validated_data["email"])

        # Starting a Celery task
        send_password_reset_email.apply_async((user.id,), queue="high_priority", priority=0)

        message = "A password reset email has been sent to your email address."
        return Response({"message": message}, status=status.HTTP_200_OK)


class PasswordResetConfirmAPIView(APIView):
    """
    Confirm and reset the user's password.
    Resets the user's password using the provided reset token and new password.
    """

    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)
