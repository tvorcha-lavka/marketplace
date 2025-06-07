from django.db import models
from django.utils.translation import gettext_lazy as _


class EmailType(models.TextChoices):
    EMAIL_VERIFICATION = "email_verification", _("Email Verification")
    RESET_PASSWORD = "reset_password", _("Reset Password")
