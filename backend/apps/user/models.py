from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    email = models.EmailField(_("email"), unique=True)
    username = models.CharField(_("username"), max_length=150)
    phone_number = models.CharField(_("phone number"), blank=True, null=True, max_length=20, unique=True)

    def __str__(self):
        return self.get_full_name()
