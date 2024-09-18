from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenBlacklistView, TokenObtainPairView

from apps.email.tasks import send_verify_email
from apps.user_auth.permissions import IsAnonymousOrAdmin

from .serializers import SignupSerializer


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
