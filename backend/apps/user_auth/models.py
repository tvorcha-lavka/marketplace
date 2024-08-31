import uuid
from datetime import timedelta
from random import randint

from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.user.models import User


class VerificationCode(models.Model):
    class Meta:
        db_table = "user_auth_verification_code"
        verbose_name = _("Verification Code")
        verbose_name_plural = _("Verification Codes")

    code = models.IntegerField()
    expires_at = models.DateTimeField()
    uuid = models.UUIDField(null=True, blank=True)

    objects = models.Manager()
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.code}"

    def save(self, *args, **kwargs):
        self.code = randint(100000, 999999)
        self.expires_at = timezone.now() + self.default_expire
        super().save(*args, **kwargs)

    @property
    def default_expire(self):
        return timedelta(minutes=10)

    @property
    def expire_in(self):
        return int(self.default_expire.total_seconds() // 60)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __int__(self):
        return self.code


class PasswordResetToken(models.Model):
    class Meta:
        db_table = "user_auth_password_reset_token"
        verbose_name = _("Password Reset Token")
        verbose_name_plural = _("Password Reset Tokens")

    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    objects = models.Manager()
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.token}"

    def save(self, *args, **kwargs):
        if not self.pk:
            self.expires_at = timezone.now() + self.default_expiry
        super().save(*args, **kwargs)

    @property
    def default_expiry(self):
        return timedelta(minutes=15)

    def is_expired(self):
        return timezone.now() > self.expires_at
