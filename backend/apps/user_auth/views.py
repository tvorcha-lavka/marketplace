from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from .jwt.mixins import TokenMixin
from .serializers import PasswordResetSerializer, UserAuthSerializer, UserSerializer, VerifyCodeSerializer


class VerifyCodeAPIView(GenericAPIView):
    """AJAX request for verification code."""

    serializer_class = VerifyCodeSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(status=status.HTTP_200_OK)


# ----------------------------------------------------------------------------------------------------------------------
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
class ResetPasswordAPIView(GenericAPIView):
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
