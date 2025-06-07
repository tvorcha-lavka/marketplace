from typing import cast

from django.conf import settings
from rest_framework.request import Request
from social_core.backends.oauth import BaseOAuth2
from social_django.utils import load_backend, load_strategy


class BackendMixin:
    service_name: str = ""
    redirect_uri: str = ""

    def get_backend(self, request: Request) -> BaseOAuth2:
        strategy = load_strategy(request)

        if not self.service_name or not self.redirect_uri:
            raise ValueError("service_name and redirect_uri must be set")

        redirect_uri = cast(str, settings.BASE_FRONTEND_URL) + self.redirect_uri
        return cast(BaseOAuth2, load_backend(strategy, self.service_name, redirect_uri))
