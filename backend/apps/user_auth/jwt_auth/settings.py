from datetime import timedelta

from django.conf import settings

settings.INSTALLED_APPS += [
    "apps.user_auth.jwt_auth",
]

settings.SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ALGORITHM": "HS256",
    "SIGNING_KEY": settings.SECRET_KEY,
    "AUTH_HEADER_TYPES": ["Bearer"],
}

if settings.DEBUG:
    settings.SIMPLE_JWT.update(
        {
            "ACCESS_TOKEN_LIFETIME": timedelta(days=7),
            "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
        }
    )
