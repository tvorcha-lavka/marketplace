from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    email = models.EmailField("Email", unique=True)
    phone_number = models.CharField("Phone Number", blank=True, null=True, max_length=20, unique=True)

    def __str__(self):
        return self.get_full_name()
