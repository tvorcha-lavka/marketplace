from celery import current_app
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import CreateAPIView, get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenBlacklistView, TokenObtainPairView

from apps.user.models import User
from apps.user_auth.mixins import TokenMixin
from apps.user_auth.permissions import IsAnonymousOrAdmin
from apps.user_auth.serializers import (
    PasswordResetConfirmSerializer,
    PasswordResetSerializer,
    SignupSerializer,
    UserAuthSerializer,
    UserSerializer,
    VerifyEmailSerializer,
)

from .tasks import send_password_reset_email, send_verification_email


class SignupAPIView(CreateAPIView):
    permission_classes = [IsAnonymousOrAdmin]
    serializer_class = SignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        send_verification_email.apply_async((user.email,), queue="high_priority", priority=0)

        message = "Please check your email to verify your account."
        return Response({"email": user.email, "message": message}, status=status.HTTP_201_CREATED)


class LoginAPIView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not serializer.user.is_email_verified:
            raise PermissionDenied("Email is not verified.")

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


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
        send_password_reset_email.apply_async((user.email,), queue="high_priority", priority=0)

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


class VerifyEmailAPIView(APIView, TokenMixin):
    request_serializer = VerifyEmailSerializer
    response_serializer = UserAuthSerializer

    @extend_schema(request=request_serializer, responses=response_serializer)
    def post(self, request):
        serializer = self.request_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        user.is_email_verified = True
        user.save()

        code_obj = serializer.validated_data["code_obj"]
        current_app.control.revoke(task_id=str(code_obj.uuid), terminate=True)
        code_obj.delete()

        response_data = {"user": UserSerializer(user).data, "token": {**self.get_token_pair(user)}}
        serializer = self.response_serializer(data=response_data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
