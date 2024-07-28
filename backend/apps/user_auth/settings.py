from django.conf import settings

from .facebook_oauth2 import settings as facebook_settings  # noqa: F401
from .google_oauth2 import settings as google_settings  # noqa: F401
from .jwt_auth import settings as jwt_settings  # noqa: F401

settings.INSTALLED_APPS += [
    "apps.user_auth.facebook_oauth2",
    "apps.user_auth.google_oauth2",
    "apps.user_auth.jwt_auth",
    "social_django",
]

settings.SOCIAL_AUTH_SESSION_COOKIE = False
settings.SOCIAL_AUTH_REDIRECT_IS_HTTPS = True
settings.SOCIAL_AUTH_FORCE_POST_DISCONNECT = True


if settings.DEBUG:
    settings.SOCIAL_AUTH_REDIRECT_IS_HTTPS = False
