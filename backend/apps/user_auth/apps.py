from django.apps import AppConfig

from . import settings  # noqa: F401


class UserAuthConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.user_auth"

    def ready(self):
        import apps.user_auth.signals  # noqa: F401
