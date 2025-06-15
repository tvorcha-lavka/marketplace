from typing import TYPE_CHECKING

from django.utils.translation import gettext_lazy as _

from core.celery.client import app
from core.celery.enums import QueueEnum

from .choices import EmailType
from .dto import BaseEmail, EmailVerification

if TYPE_CHECKING:  # pragma: no cover
    from django.utils.functional import _StrPromise


def notify_user_verify_email(email: str) -> "_StrPromise":
    dto = EmailVerification(
        email_type=EmailType.EMAIL_VERIFICATION,
        recipient=email,
        template="email-verification.html",
        subject=str(_("Email verification")),
        body=str(_("Hi! Your email verification code: <VERIFICATION_CODE>")),
    )
    kwargs = {"json_str": dto.model_dump_json()}
    app.send_task(name="email.notification.verification", queue=QueueEnum.NOTIFICATION, kwargs=kwargs)

    return _("Please check your email to verify your account.")


def notify_user_successful_registration(email: str) -> None:
    dto = BaseEmail(
        recipient=email,
        template="end-of-registration.html",
        subject=str(_("Welcome to Tvorcha Lavka!")),
        body=str(_("Hi! Thank you for registering on Tvorcha Lavka!")),
    )

    kwargs = {"json_str": dto.model_dump_json()}
    app.send_task(name="email.notification.welcome", queue=QueueEnum.NOTIFICATION, kwargs=kwargs)


def notify_user_password_recovery(email: str) -> "_StrPromise":
    dto = EmailVerification(
        email_type=EmailType.PASSWORD_RECOVERY,
        recipient=email,
        template="password-recovery.html",
        subject=str(_("Password recovery")),
        body=str(_("Hi! Your password recovery code: <VERIFICATION_CODE>")),
    )

    kwargs = {"json_str": dto.model_dump_json()}
    app.send_task(name="email.notification.verification", queue=QueueEnum.NOTIFICATION, kwargs=kwargs)

    return _("A password recovery email has been sent to your email address.")
