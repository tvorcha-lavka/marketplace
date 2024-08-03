from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from .validators import validate_email, validate_name, validate_phone_number, validate_username


class User(AbstractUser):
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    email = models.EmailField(_("email"), unique=True, validators=[validate_email])
    username = models.CharField(_("username"), max_length=150, validators=[validate_username])
    first_name = models.CharField(_("first name"), max_length=150, blank=True, validators=[validate_name])
    last_name = models.CharField(_("last name"), max_length=150, blank=True, validators=[validate_name])
    phone_number = models.CharField(
        _("phone number"), unique=True, max_length=20, null=True, validators=[validate_phone_number]
    )

    def __str__(self):
        return self.get_full_name()
