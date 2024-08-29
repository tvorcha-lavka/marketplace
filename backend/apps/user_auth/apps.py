from django.apps import AppConfig


class UserAuthConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.user_auth"

    def ready(self):
        import apps.user_auth.signals  # noqa: F401
