from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.user_auth.helpers import OAuth2Redirect, get_token_pair
from apps.user_auth.serializers import SignupSerializer

from .utils import GoogleOAuth2Service


class GoogleOAuth2Redirect(OAuth2Redirect):
    reverse_url_name = "google-oauth2-complete"
    service_name = "google-oauth2"


class GoogleOAuth2TokenView(APIView, GoogleOAuth2Service):
    permission_classes = [AllowAny]
    serializer_class = SignupSerializer

    def get(self, request):
        user = self.get_user(request)
        serializer = self.serializer_class(user)
        token_pair = get_token_pair(user)

        return Response({"user": serializer.data, **token_pair})
