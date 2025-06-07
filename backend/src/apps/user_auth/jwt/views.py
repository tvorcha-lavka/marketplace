from typing import Any, cast

from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework_simplejwt.views import TokenViewBase

from apps.email.tasks import send_verify_email
from apps.user.models import User
from apps.user.serializers import UserSerializer
from apps.user_auth.serializers import UserAuthSerializer, VerifyCodeSerializer

from .mixins import TokenMixin
from .redis import get_temporary_signup_data, save_temporary_signup_data, temporary_signup_data_is_exists
from .serializers import SignupSerializer, TokenObtainPairSerializer, TokenRefreshSerializer


class TokenObtainPairView(TokenViewBase):
    """
    Takes a set of user credentials and returns an access and refresh JSON web
    token pair to prove the authentication of those credentials.
    """

    serializer_class = TokenObtainPairSerializer  # type: ignore[assignment]


class TokenRefreshView(TokenViewBase):
    """
    Takes a refresh type JSON web token and returns an access type JSON web
    token if the refresh token is valid.
    """

    serializer_class = TokenRefreshSerializer  # type: ignore[assignment]


class SignupAPIView(GenericAPIView[Any]):
    """
    Request a signup for a user.
    Sends a verification email to the user with the provided email address.
    """

    serializer_class = SignupSerializer
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        if temporary_signup_data_is_exists(email):
            message = str(_("A verification code was recently sent to user email."))
            return Response({"message": message}, status=status.HTTP_307_TEMPORARY_REDIRECT)

        result, message = send_verify_email(email)
        save_temporary_signup_data(email, serializer.validated_data)

        return Response({"email": email, "message": message}, status=status.HTTP_200_OK)


class SignupCompleteAPIView(GenericAPIView[Any], TokenMixin):
    """Request to register a user with the provided credentials."""

    serializer_class = VerifyCodeSerializer
    response_serializer = UserAuthSerializer
    permission_classes = [AllowAny]

    @extend_schema(request=serializer_class, responses=response_serializer)
    def post(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        if not (signup_data := get_temporary_signup_data(email)):
            raise ValidationError(str(_("Something went wrong. Please try again.")))

        user = User.objects.create(**signup_data, is_email_verified=True)

        code_obj = serializer.validated_data["code_obj"]
        code_obj.delete()

        response_data = {"user": UserSerializer(user).data, "token": {**self.get_token_pair(user)}}
        return Response(response_data, status=status.HTTP_201_CREATED)


class LoginAPIView(TokenObtainPairView):
    """Request to login a user."""

    serializer_class = TokenObtainPairSerializer
    response_serializer = TokenObtainPairSerializer

    @extend_schema(request=serializer_class, responses=response_serializer)
    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = cast(TokenObtainSerializer, serializer).user

        if user and not user.is_email_verified:
            raise PermissionDenied(str(_("Email is not verified.")))

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
