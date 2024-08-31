from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from apps.user.models import User
from apps.user_auth.models import PasswordResetToken, VerificationCode


@shared_task
def remove_expired_tokens():
    # Removing expired tokens from BlacklistedToken
    blacklisted_expired_tokens = BlacklistedToken.objects.filter(token__expires_at__lte=timezone.now())  # type: ignore
    blacklisted_expired_tokens.delete()

    # Removing expired tokens from OutstandingToken
    outstanding_expired_tokens = OutstandingToken.objects.filter(expires_at__lte=timezone.now())  # type: ignore
    outstanding_expired_tokens.delete()

    # Removing expired tokens from PasswordResetToken
    reset_expired_tokens = PasswordResetToken.objects.filter(expires_at__lte=timezone.now())
    reset_expired_tokens.delete()

    # Removing expired code from VerificationCode
    expired_verification_codes = VerificationCode.objects.filter(expires_at__lte=timezone.now())
    expired_verification_codes.delete()


@shared_task
def send_password_reset_email(email: str):
    user = User.objects.get(email=email)
    token, created = PasswordResetToken.objects.get_or_create(user=user)

    if token.is_expired():
        token.delete()
        token = PasswordResetToken.objects.create(user=user)

    verification_link = f"{settings.BASE_FRONTEND_URL}/password/reset/{str(token)}/"
    send_mail(
        subject="Confirming the password reset",
        message=f"Click the link to reset password: {verification_link}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )


@shared_task
def send_verification_email(email: str):
    user = User.objects.get(email=email)
    code, created = VerificationCode.objects.get_or_create(user=user)

    if code.is_expired():
        code.delete()
        code = VerificationCode.objects.create(user=user)

    context = {"username": user.username, "code": str(code), "expire_in": code.expire_in}
    html_content = render_to_string("email_verification.html", context)
    text_content = f"Вітаю, {user.username}! Ваш код підтвердження: {str(code)}"

    email = EmailMultiAlternatives(
        subject="Підтвердження електронної пошти",
        body=text_content,
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


@shared_task
def delete_non_verified_user(user_id: int):
    user = User.objects.get(id=user_id)
    if not user.is_email_verified:
        user.delete()
