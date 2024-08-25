import uuid
from datetime import timedelta

from django.db import models
from django.utils import timezone

from apps.user.models import User


class BaseToken(models.Model):
    class Meta:
        abstract = True

    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    objects = models.Manager()
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.__class__.__name__} - {self.token}"

    def save(self, *args, **kwargs):
        if not self.pk:
            self.expires_at = timezone.now() + self.default_expiry()
        super().save(*args, **kwargs)

    def default_expiry(self):
        raise NotImplementedError("Subclasses must implement `default_expiry`")

    def is_expired(self):
        return timezone.now() > self.expires_at


class PasswordResetToken(BaseToken):
    def default_expiry(self):
        return timedelta(minutes=15)


class EmailVerificationToken(BaseToken):
    def default_expiry(self):
        return timedelta(days=1)
