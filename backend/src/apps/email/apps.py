from django.apps import AppConfig

from . import settings  # noqa: F401


class EmailConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.email"
