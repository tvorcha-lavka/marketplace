from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import CreateAPIView, GenericAPIView, get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenBlacklistView, TokenObtainPairView

from apps.user.models import User
from apps.user_auth.mixins import TokenMixin
from apps.user_auth.permissions import IsAnonymousOrAdmin
from apps.user_auth.serializers import (
    EmailSerializer,
    PasswordResetSerializer,
    SignupSerializer,
    UserAuthSerializer,
    UserSerializer,
    VerifyCodeSerializer,
)

from .tasks import send_reset_password, send_verify_email


class SignupAPIView(CreateAPIView):
    """
    Request a signup for a user.
    Sends a verification email to the user with the provided email address.
    """

    permission_classes = [IsAnonymousOrAdmin]
    serializer_class = SignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        result, message = send_verify_email(user)
        return Response({"message": message}, status=status.HTTP_201_CREATED)


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


# ----------------------------------------------------------------------------------------------------------------------
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


class VerifyEmailAddressAPIView(GenericAPIView, TokenMixin):
    """Verify a user's email address and give them access to the site."""

    request_serializer = VerifyCodeSerializer
    response_serializer = UserAuthSerializer

    @extend_schema(request=request_serializer, responses=response_serializer)
    def post(self, request):
        serializer = self.request_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        user.verify_email()

        code_obj = serializer.validated_data["code_obj"]
        code_obj.delete()

        response_data = {"user": UserSerializer(user).data, "token": {**self.get_token_pair(user)}}
        serializer = self.response_serializer(data=response_data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


# ----------------------------------------------------------------------------------------------------------------------
class SendPasswordResetAPIView(EmailAPIView):
    """Sends a password reset email to the user with the provided email address."""

    def perform_action(self, user):
        return send_reset_password(user)


class PasswordResetAPIView(GenericAPIView):
    """Resets the user's password using the provided reset code sent to email."""

    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        raw_password = serializer.validated_data["password"]
        user.set_new_password(raw_password)

        code_obj = serializer.validated_data["code_obj"]
        code_obj.delete()

        message = "Password has been changed successfully."
        return Response({"message": message}, status=status.HTTP_200_OK)


# ----------------------------------------------------------------------------------------------------------------------
class VerifyCodeAPIView(GenericAPIView):
    """AJAX request for verification code."""

    serializer_class = VerifyCodeSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(status=status.HTTP_200_OK)
