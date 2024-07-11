from django.conf import settings
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from apps.user_auth.helpers import OAuth2Redirect, get_token_pair

from .serializers import GoogleOAuth2Serializer
from .utils import GoogleOAuth2Service


class GoogleOAuth2Redirect(OAuth2Redirect):
    redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
    service_name = settings.GOOGLE_OAUTH2_SERVICE_NAME


class GoogleOAuth2TokenView(CreateAPIView, GoogleOAuth2Service):
    """Exchange google code for user data and JSON web token pair."""

    serializer_class = GoogleOAuth2Serializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.get_user(request)
        token_pair = get_token_pair(user)

        serializer = self.get_serializer({"user": user, **token_pair})
        return Response(serializer.data)
