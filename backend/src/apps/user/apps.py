from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _
from django_stubs_ext import monkeypatch

monkeypatch()


class UserConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.user"
    verbose_name = _("User")

    def ready(self) -> None:
        import apps.user.receivers  # noqa: F401
