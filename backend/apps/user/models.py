from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Meta:
        verbose_name = "Користувач"
        verbose_name_plural = "Користувачі"

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    phone_number = models.CharField("Телефон", max_length=20, unique=True)
    email = models.EmailField("Електронна пошта", unique=True)

    def __str__(self):
        return self.get_full_name()
