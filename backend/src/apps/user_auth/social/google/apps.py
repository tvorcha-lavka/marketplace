from django.apps import AppConfig

from . import settings  # noqa: F401


class GoogleOAuth2Config(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.user_auth.social.google"
