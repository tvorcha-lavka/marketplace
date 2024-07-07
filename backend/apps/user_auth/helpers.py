from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from social_django.utils import load_backend, load_strategy


def get_token_pair(user):
    token_pair = RefreshToken.for_user(user)
    return {
        "refresh": str(token_pair),
        "access": str(token_pair.access_token),  # type: ignore
    }


class OAuth2Redirect(APIView):
    permission_classes = [AllowAny]
    reverse_url_name = None
    service_name = None

    def get(self, request):
        strategy = load_strategy(request)
        redirect_uri = reverse(self.reverse_url_name)
        backend = load_backend(strategy, self.service_name, redirect_uri=redirect_uri)
        return Response({"auth_url": backend.auth_url()})
