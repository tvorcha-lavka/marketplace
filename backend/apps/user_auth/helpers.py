from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from social_django.utils import load_backend, load_strategy

from apps.user_auth.serializers import OAuth2RedirectSerializer


def get_token_pair(user):
    token_pair = RefreshToken.for_user(user)
    return {
        "refresh": str(token_pair),
        "access": str(token_pair.access_token),  # type: ignore
    }


class OAuth2Redirect(APIView):
    """
    Returns the authorization URL (`auth_url`) and
    the redirection endpoint (`redirect_uri`) after successful authorization.
    """

    serializer_class = OAuth2RedirectSerializer
    redirect_uri, service_name = None, None

    @method_decorator(cache_page(300))  # cache for 5 minutes
    def get(self, request):
        strategy = load_strategy(request)
        redirect_uri = settings.BASE_FRONTEND_URL + self.redirect_uri
        backend = load_backend(strategy, self.service_name, redirect_uri=redirect_uri)
        return Response({"auth_url": backend.auth_url(), "redirect_uri": redirect_uri})
