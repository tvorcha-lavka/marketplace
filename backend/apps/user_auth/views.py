from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.user_auth.jwt_auth.tasks import send_welcome_email
from apps.user_auth.mixins import BackendMixin, TokenMixin

from .serializers import SocialCallbackOAuth2Serializer, SocialOAuth2RedirectSerializer


class SocialOAuth2RedirectView(APIView, BackendMixin):
    """Returns the authorization URL `auth_url`."""

    serializer_class = SocialOAuth2RedirectSerializer

    def get(self, request):
        backend = self.get_backend(request)
        return Response({"auth_url": backend.auth_url()})


class SocialOAuth2CallbackView(CreateAPIView, TokenMixin, BackendMixin):
    """Exchange social code for user data and JSON web token pair."""

    serializer_class = SocialCallbackOAuth2Serializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        backend = self.get_backend(request)
        backend.data = serializer.validated_data

        try:
            user = backend.complete()
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_email_verified:
            user.is_email_verified = True
            user.save()
            send_welcome_email.apply_async((user.email,), queue="default", priority=0)

        if user and user.is_active:
            token_pair = self.get_token_pair(user)
            serializer = self.get_serializer({"user": user, **token_pair})
            return Response(serializer.data)

        return Response({"detail": "Authentication failed"}, status=status.HTTP_403_FORBIDDEN)
