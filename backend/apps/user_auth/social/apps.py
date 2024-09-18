from django.apps import AppConfig

from . import settings  # noqa: F401


class SocialAuthConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.user_auth.social"
