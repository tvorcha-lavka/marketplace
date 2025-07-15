from django.db import models
from django.utils.translation import gettext_lazy as _


class EmailType(models.TextChoices):
    EMAIL_VERIFICATION = "email_verification", _("Email verification")
    PASSWORD_RECOVERY = "password_recovery", _("Password recovery")
