from typing import Tuple

from celery import shared_task
from celery.result import AsyncResult
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _

from apps.user.models import User
from apps.user_auth.models import CodeType, VerificationCode


def send_verify_email(user: User) -> Tuple[AsyncResult, str]:
    code_type = CodeType.EMAIL_VERIFICATION
    template = "email_verification.html"
    subject = "Підтвердження електронної пошти"
    body = f"Вітаю, {user.username}!\n" f"Ваш код підтвердження: <VERIFICATION_CODE>"
    message = _("Please check your email to verify your account.")

    return (
        send_verification_code.apply_async(
            (user.email, code_type, template, subject, body),
            queue="high_priority",
            priority=0,
        ),
        message,
    )


def send_reset_password(user: User) -> Tuple[AsyncResult, str]:
    code_type = CodeType.RESET_PASSWORD
    template = "reset_password.html"
    subject = "Підтвердження на зміну пароля"
    body = f"Вітаю, {user.username}!\n" f"Ваш код підтвердження зміни пароля: <VERIFICATION_CODE>"
    message = _("A password reset email has been sent to your email address.")

    return (
        send_verification_code.apply_async(
            (user.email, code_type, template, subject, body),
            queue="high_priority",
            priority=0,
        ),
        message,
    )


@shared_task
def send_verification_code(recipient: str, code_type: CodeType, template: str, subject: str, body: str):
    user = User.objects.get(email=recipient)

    code, new_obj = VerificationCode.objects.get_or_create(user=user, code_type=code_type)
    code = code if new_obj else code.re_create()  # re-create code if re-request to send email

    context = {"username": user.username, "code": str(code), "expire_in": code.expire_in}
    html_content = render_to_string(template, context)

    email = EmailMultiAlternatives(
        subject=subject,
        body=body.replace("<VERIFICATION_CODE>", str(code)),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.attach_alternative(html_content, "text/html")
    email.send()


@shared_task
def send_welcome_email(email: str):
    user = User.objects.get(email=email)

    send_mail(
        subject="Welcome to TvorchaLavka",
        message=f"Hi, {user.username}! Thank you for registering TvorchaLavka!.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )
