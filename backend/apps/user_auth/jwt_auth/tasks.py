from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from apps.user.models import User
from apps.user_auth.models import EmailVerificationToken, PasswordResetToken


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

    # Removing expired tokens from EmailVerificationToken
    email_expired_tokens = EmailVerificationToken.objects.filter(expires_at__lte=timezone.now())
    email_expired_tokens.delete()


@shared_task
def send_password_reset_email(email: str):
    user = User.objects.get(email=email)
    token, created = PasswordResetToken.objects.get_or_create(user=user)

    if token.is_expired():
        token.delete()
        token = PasswordResetToken.objects.create(user=user)

    verification_link = f"{settings.BASE_FRONTEND_URL}/password/reset/{token.token}/"
    send_mail(
        subject="Confirming the password reset",
        message=f"Click the link to reset password: {verification_link}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )


@shared_task
def send_verification_email(email: str):
    user = User.objects.get(email=email)
    token, created = EmailVerificationToken.objects.get_or_create(user=user)

    if token.is_expired():
        token.delete()
        token = EmailVerificationToken.objects.create(user=user)

    verify_url = f"{settings.BASE_FRONTEND_URL}/verify-email/{token.token}"
    send_mail(
        subject="Email Confirmation",
        message=f"Hi, {user.username}! Please confirm your email: {verify_url}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )


@shared_task
def send_welcome_email(email: str):
    user = User.objects.get(email=email)

    send_mail(
        subject="Welcome to TvorchaLavka",
        message=f"Hi, {user.username}! Thank you for registering TvorchaLavka!.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )
