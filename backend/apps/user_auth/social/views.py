from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.email.tasks import send_welcome_email
from apps.user.serializers import UserSerializer
from apps.user_auth.jwt.mixins import TokenMixin
from apps.user_auth.serializers import UserAuthSerializer

from .mixins import BackendMixin
from .serializers import SocialCallbackOAuth2Serializer, SocialOAuth2RedirectSerializer


class SocialOAuth2RedirectView(GenericAPIView, BackendMixin):
    """Returns the authorization URL `auth_url`."""

    serializer_class = SocialOAuth2RedirectSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        backend = self.get_backend(request)
        return Response({"auth_url": backend.auth_url()})


class SocialOAuth2CallbackView(CreateAPIView, TokenMixin, BackendMixin):
    """Exchange social code for user data and JSON web token pair."""

    serializer_class = SocialCallbackOAuth2Serializer
    response_serializer = UserAuthSerializer
    permission_classes = [AllowAny]

    @extend_schema(request=serializer_class, responses=response_serializer)
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        backend = self.get_backend(request)
        backend.data = serializer.validated_data
        backend.STATE_PARAMETER = False

        try:
            user = backend.complete()
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_email_verified:
            user.verify_email()
            send_welcome_email.apply_async((user.email,), queue="low_priority", priority=0)

        if user and user.is_active:
            response_data = {"user": UserSerializer(user).data, "token": {**self.get_token_pair(user)}}
            serializer = self.response_serializer(data=response_data)
            serializer.is_valid(raise_exception=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"detail": _("Authentication failed.")}, status=status.HTTP_403_FORBIDDEN)
