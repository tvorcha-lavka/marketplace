from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from social_django.utils import load_backend, load_strategy


class TokenMixin:
    @staticmethod
    def get_token_pair(user):
        token_pair = RefreshToken.for_user(user)
        return {
            "refresh": str(token_pair),
            "access": str(token_pair.access_token),  # type: ignore
        }


class BackendMixin:
    service_name = None
    redirect_uri = None

    def get_backend(self, request):
        strategy = load_strategy(request)
        redirect_uri = settings.BASE_FRONTEND_URL + self.redirect_uri
        return load_backend(strategy, self.service_name, redirect_uri=redirect_uri)
