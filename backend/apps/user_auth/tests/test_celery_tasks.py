import uuid
from collections import namedtuple
from datetime import timedelta
from unittest.mock import patch

import pytest
from django.conf import settings
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from apps.user_auth.jwt_auth.tasks import remove_expired_tokens, send_password_reset_email, send_verification_email
from apps.user_auth.models import EmailVerificationToken, PasswordResetToken

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
PasswordReset = namedtuple("PasswordResetTestCaseSchema", ["created_at", "expected_token_count"])
VerifyEmail = namedtuple("VerifyEmailTestCaseSchema", ["created_at", "expected_token_count"])


# ----- Test Cases -----------------------------------------------------------------------------------------------------
password_reset_test_case = [
    # "created_at", "expected_token_count"
    PasswordReset(timezone.now(), 1),
    PasswordReset(timezone.now() - timedelta(days=1), 1),
]

verify_email_test_case = [
    # "created_at", "expected_token_count"
    VerifyEmail(timezone.now(), 1),
    VerifyEmail(timezone.now() - timedelta(days=1), 1),
]


# ----- Test Remove Expired Tokens -------------------------------------------------------------------------------------
@pytest.mark.django_db
def test_remove_expired_tokens(users):
    expires_at = timezone.now() - timedelta(days=1)

    def create_refresh_token(user):
        return OutstandingToken.objects.create(token=uuid.uuid4(), user=user, expires_at=expires_at)  # type: ignore

    def put_refresh_token_to_blacklist(token):
        BlacklistedToken.objects.create(token=token)  # type: ignore

    def create_password_reset_token(user):
        password_reset_token = PasswordResetToken.objects.create(user=user)
        password_reset_token.expires_at = expires_at
        password_reset_token.save()

    refresh_token = create_refresh_token(users.user1)
    put_refresh_token_to_blacklist(refresh_token)
    create_password_reset_token(users.user1)

    remove_expired_tokens.apply()

    assert not BlacklistedToken.objects.filter(id=refresh_token.id).exists()  # type: ignore
    assert not OutstandingToken.objects.filter(id=refresh_token.id).exists()  # type: ignore
    assert not PasswordResetToken.objects.filter(user=users.user1).exists()


# ----- Test Send Reset Password Email ---------------------------------------------------------------------------------
@pytest.mark.django_db
@patch("apps.user_auth.jwt_auth.tasks.send_mail")
@pytest.mark.parametrize("test_case", password_reset_test_case)
def test_send_password_reset_email(mock_send_mail, users, test_case: PasswordReset):
    user = users.user1

    def create_reset_token():
        reset_token = PasswordResetToken.objects.create(user=user)
        reset_token.expires_at = test_case.created_at + timedelta(minutes=15)
        reset_token.save()

    create_reset_token()

    result = send_password_reset_email.apply_async((user.email,), queue="high_priority", priority=0)
    result.get()

    mock_send_mail.assert_called_once()
    mail_kwargs = mock_send_mail.call_args.kwargs

    token = PasswordResetToken.objects.filter(user=user).first()
    verification_link = f"{settings.BASE_FRONTEND_URL}/password/reset/{token.token}/"

    assert "Confirming the password reset" in mail_kwargs["subject"]
    assert verification_link in mail_kwargs["message"]

    assert PasswordResetToken.objects.filter(user=users.user1).count() == test_case.expected_token_count


# ----- Test Send Verify Email ---------------------------------------------------------------------------------
@pytest.mark.django_db
@patch("apps.user_auth.jwt_auth.tasks.send_mail")
@pytest.mark.parametrize("test_case", verify_email_test_case)
def test_send_verify_email(mock_send_mail, users, test_case: VerifyEmail):
    user = users.user1

    def create_verify_token():
        verify_token = EmailVerificationToken.objects.create(user=user)
        verify_token.expires_at = test_case.created_at + timedelta(days=1)
        verify_token.save()

    create_verify_token()

    result = send_verification_email.apply_async((user.email,), queue="high_priority", priority=0)
    result.get()

    mock_send_mail.assert_called_once()
    mail_kwargs = mock_send_mail.call_args.kwargs

    token = EmailVerificationToken.objects.filter(user=user).first()
    verification_link = f"{settings.BASE_FRONTEND_URL}/verify-email/{token.token}"

    assert "Email Confirmation" in mail_kwargs["subject"]
    assert verification_link in mail_kwargs["message"]

    assert EmailVerificationToken.objects.filter(user=users.user1).count() == test_case.expected_token_count
