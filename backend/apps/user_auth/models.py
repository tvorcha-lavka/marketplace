from datetime import timedelta
from random import randint

from django.db import models
from django.db.models.signals import ModelSignal
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.user.models import User

email_verification_signal = ModelSignal(use_caching=True)
reset_password_signal = ModelSignal(use_caching=True)


class CodeType(models.TextChoices):
    EMAIL_VERIFICATION = "email_verification", _("Email Verification")
    RESET_PASSWORD = "reset_password", _("Reset Password")


class VerificationCode(models.Model):
    class Meta:
        db_table = "user_auth_verification_code"
        verbose_name = _("Verification Code")
        verbose_name_plural = _("Verification Codes")

    code = models.IntegerField()
    code_type = models.CharField(max_length=20, choices=CodeType)
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
        self.post_save()

    @property
    def default_expire(self):
        return timedelta(minutes=10)

    @property
    def expire_in(self):
        return int(self.default_expire.total_seconds() // 60)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def post_save(self):
        signal_map = {
            CodeType.EMAIL_VERIFICATION: email_verification_signal,
            CodeType.RESET_PASSWORD: reset_password_signal,
        }
        signal_map[self.code_type].send(sender=self.__class__, instance=self)  # type: ignore

    def re_create(self) -> object:
        self.delete()  # Send a signal to revoke a Celery task, then delete the active code.
        return self.__class__.objects.create(user=self.user, code_type=self.code_type)

    def __int__(self):
        return self.code
