from typing import Awaitable, Callable, TypeAlias

from django.conf import settings
from django.http import HttpRequest
from django.utils.translation import get_language_from_request, override
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import Token

GetResponse: TypeAlias = Callable[[HttpRequest], Response | Awaitable[Response]]
BytesOrNone: TypeAlias = bytes | None


class JWTLanguageMiddleware:

    SUPPORTED_LANGUAGES = {code for code, _ in settings.LANGUAGES}
    FALLBACK_LANGUAGE = settings.LANGUAGE_CODE
    jwt = JWTAuthentication()

    __slots__ = ("get_response",)

    def __init__(self, get_response: GetResponse) -> None:
        self.get_response = get_response

    def get_language_from_token(self, request: HttpRequest) -> str | None:
        """
        Validates an encoded JSON web token and returns a
        language code of user, otherwise return None.
        """
        drf_request = Request(request)

        header: BytesOrNone = self.jwt.get_header(drf_request)
        if header is None:
            return None

        raw_token: BytesOrNone = self.jwt.get_raw_token(header)
        if raw_token is None:
            return None

        try:
            token: Token = self.jwt.get_validated_token(raw_token)
        except InvalidToken:
            return None

        return token.payload.get("language")

    def __call__(self, request: HttpRequest) -> Response | Awaitable[Response]:
        """
        Parse encoded JSON web token and set the response language based on
        token preferences, otherwise get language from request.
        """
        user_language = self.get_language_from_token(request) or get_language_from_request(request)
        language = user_language if user_language in self.SUPPORTED_LANGUAGES else self.FALLBACK_LANGUAGE

        with override(language):
            request.LANGUAGE_CODE = language
            return self.get_response(request)
