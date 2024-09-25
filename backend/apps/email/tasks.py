from typing import Tuple

from celery import shared_task
from celery.result import AsyncResult
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _

from apps.user.models import User
from apps.user_auth.models import VerificationCode

from .models import EmailType


def send_verify_email(email: str) -> Tuple[AsyncResult, str]:
    email_type = EmailType.EMAIL_VERIFICATION
    template = "email_verification.html"
    subject = _("Email verification")
    body = _("Hi!\nYour confirmation code: %(code)s") % {"code": "<VERIFICATION_CODE>"}
    api_message = _("Please check your email to verify your account.")

    return (
        send_verification_code.apply_async(
            args=(email, email_type, template, subject, body),
            queue="high_priority",
            priority=0,
        ),
        api_message,
    )


def send_reset_password(user: User) -> Tuple[AsyncResult, str]:
    email_type = EmailType.RESET_PASSWORD
    template = "reset_password.html"
    subject = _("Password change confirmation")
    body = _("Hi %(username)s!\nYour password change confirmation code: %(code)s") % {
        "username": user.username,
        "code": "<VERIFICATION_CODE>",
    }

    api_message = _("A password reset email has been sent to your email address.")

    return (
        send_verification_code.apply_async(
            args=(user.email, email_type, template, subject, body),
            kwargs={"username": user.username},
            queue="high_priority",
            priority=0,
        ),
        api_message,
    )


@shared_task
def send_verification_code(recipient: str, email_type: EmailType, template: str, subject: str, body: str, **kwargs):
    code, new_obj = VerificationCode.objects.get_or_create(email=recipient, email_type=email_type)
    code = code if new_obj else code.re_create()  # re-create code if re-request to send email

    context = {"code": str(code), "expire_in": code.expire_in, **kwargs}
    html_content = render_to_string(template, context)

    email = EmailMultiAlternatives(
        subject=subject,
        body=body.replace("<VERIFICATION_CODE>", str(code)),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient],
    )
    email.attach_alternative(html_content, "text/html")
    email.send()


@shared_task
def send_welcome_email(email: str):
    user = User.objects.get(email=email)
    subject = _("Welcome to Tvorcha Lavka!")
    message = _("Hi, %(username)s. Thank you for registering Tvorcha Lavka!") % {"username": user.username}

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )
