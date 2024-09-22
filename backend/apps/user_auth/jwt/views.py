from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenBlacklistView, TokenObtainPairView

from apps.email.tasks import send_verify_email
from apps.user.models import User
from apps.user.serializers import UserSerializer
from apps.user_auth.serializers import UserAuthSerializer, VerifyCodeSerializer

from .mixins import TokenMixin
from .redis import get_temporary_signup_data, save_temporary_signup_data, temporary_signup_data_is_exists
from .serializers import SignupSerializer


class SignupAPIView(GenericAPIView):
    """
    Request a signup for a user.
    Sends a verification email to the user with the provided email address.
    """

    serializer_class = SignupSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        if temporary_signup_data_is_exists(email):
            message = "A verification code was recently sent to user email."
            return Response({"message": message}, status=status.HTTP_307_TEMPORARY_REDIRECT)

        result, message = send_verify_email(email)
        save_temporary_signup_data(email, serializer.validated_data)

        return Response({"email": email, "message": message}, status=status.HTTP_200_OK)


class SignupCompleteAPIView(GenericAPIView, TokenMixin):
    """Request to register a user with the provided credentials."""

    serializer_class = VerifyCodeSerializer
    response_serializer = UserAuthSerializer

    @extend_schema(request=serializer_class, responses=response_serializer)
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        signup_data = get_temporary_signup_data(email)
        user = User.objects.create(**signup_data, is_email_verified=True)

        code_obj = serializer.validated_data["code_obj"]
        code_obj.delete()

        response_data = {"user": UserSerializer(user).data, "token": {**self.get_token_pair(user)}}
        return Response(response_data, status=status.HTTP_201_CREATED)


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
