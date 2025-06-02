from django.conf import settings
from django.utils.translation import get_language_from_request, override
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication


class JWTLanguageMiddleware:

    __slots__ = ("get_response",)

    SUPPORTED_LANGUAGES = {code for code, _ in settings.LANGUAGES}
    FALLBACK_LANGUAGE = settings.LANGUAGE_CODE
    jwt_auth = JWTAuthentication()

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        """
        Authenticate the user if its possible,
        set the response language based on his preferences
        otherwise ignore authentication and get language from request.
        """
        try:
            if user_auth_tuple := self.jwt_auth.authenticate(request):
                request._user, request._auth = user_auth_tuple
                request.user = request._user
        except AuthenticationFailed:
            pass

        user_language = getattr(request.user, "language", None) or get_language_from_request(request)
        language = user_language if user_language in self.SUPPORTED_LANGUAGES else self.FALLBACK_LANGUAGE

        with override(language):
            request.LANGUAGE_CODE = language
            return self.get_response(request)
