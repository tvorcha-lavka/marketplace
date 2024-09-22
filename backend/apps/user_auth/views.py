from rest_framework import status
from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.response import Response

from apps.user.models import User

from .serializers import PasswordResetSerializer


class ResetPasswordAPIView(GenericAPIView):
    """Resets the user's password using the provided reset code sent to email."""

    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        raw_password = serializer.validated_data["password"]

        user = get_object_or_404(User, email=email)
        user.set_new_password(raw_password)

        code_obj = serializer.validated_data["code_obj"]
        code_obj.delete()

        message = "Password has been changed successfully."
        return Response({"message": message}, status=status.HTTP_200_OK)
