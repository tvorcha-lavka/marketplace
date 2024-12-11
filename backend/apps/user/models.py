from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.utils.models import UUIDv7Model

from .validators import validate_email, validate_name, validate_phone_number, validate_username


class CustomUserManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_email_verified", True)
        return super().create_superuser(username, email, password, **extra_fields)


class User(UUIDv7Model, AbstractUser):
    class Meta:
        db_table = "user"
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    email = models.EmailField(_("email"), unique=True, validators=[validate_email])
    username = models.CharField(_("username"), max_length=150, validators=[validate_username])

    first_name = models.CharField(_("first name"), max_length=150, blank=True, validators=[validate_name])
    last_name = models.CharField(_("last name"), max_length=150, blank=True, validators=[validate_name])

    phone_number = models.CharField(
        _("phone number"),
        max_length=20,
        unique=True,
        null=True,
        validators=[validate_phone_number],
    )

    language = models.CharField(_("language"), max_length=2, null=True, blank=True)
    is_email_verified = models.BooleanField(_("is email verified"), default=False)
    # TODO: rating = models.DecimalField(_("rating"), max_digits=3, decimal_places=2, default=0.0)

    objects = CustomUserManager()

    def __str__(self):
        return self.username

    def verify_email(self):
        self.is_email_verified = True
        self.save(force_update=True, update_fields=["is_email_verified"])

    def set_new_password(self, raw_password):
        super().set_password(raw_password)
        self.save(force_update=True, update_fields=["password"])
