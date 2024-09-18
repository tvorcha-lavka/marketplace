from django.conf import settings

settings.INSTALLED_APPS += [
    "apps.user_auth.jwt",
    "apps.user_auth.social",
]
