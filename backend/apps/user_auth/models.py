from datetime import timedelta
from random import randint

from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.email.models import EmailType


class VerificationCode(models.Model):
    class Meta:
        db_table = "user_auth_verification_code"
        verbose_name = _("Verification Code")
        verbose_name_plural = _("Verification Codes")

    code = models.IntegerField(_("code"))
    expires_at = models.DateTimeField(_("expires at"))

    email = models.EmailField(_("email"), unique=True)
    email_type = models.CharField(_("email type"), max_length=20, choices=EmailType)

    uuid = models.UUIDField(_("uuid"), null=True, blank=True)
    objects = models.Manager()

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

    def re_create(self) -> object:
        self.delete()  # Send a signal to revoke a Celery task, then delete the active code.
        return self.__class__.objects.create(email=self.email, email_type=self.email_type)

    def __int__(self):
        return self.code
