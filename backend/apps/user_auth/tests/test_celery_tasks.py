import uuid
from collections import namedtuple
from datetime import timedelta
from unittest.mock import MagicMock, patch

import pytest
from django.conf import settings
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from apps.user.models import User
from apps.user_auth.jwt_auth.tasks import (
    delete_non_verified_user,
    remove_expired_tokens,
    send_password_reset_email,
    send_verification_email,
)
from apps.user_auth.models import PasswordResetToken, VerificationCode

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
PasswordReset = namedtuple("PasswordResetTestCaseSchema", ["created_at", "expected_token_count"])
VerifyEmail = namedtuple("VerifyEmailTestCaseSchema", ["valid_code", "expected_token_count"])
VerifiedUser = namedtuple("VerifiedUserTestCaseSchema", ["user", "is_email_verified"])


# ----- Test Cases -----------------------------------------------------------------------------------------------------
password_reset_test_case = [
    # "created_at", "expected_token_count"
    PasswordReset(timezone.now(), 1),
    PasswordReset(timezone.now() - timedelta(days=1), 1),
]

verify_email_test_case = [
    # "valid_code", "expected_token_count"
    VerifyEmail(True, 1),
    VerifyEmail(False, 1),
]

delete_non_verified_user_test_case = [
    # "user", "is_email_verified"
    VerifiedUser("user1", True),
    VerifiedUser("user1", False),
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
    verification_link = f"{settings.BASE_FRONTEND_URL}/password/reset/{str(token)}/"

    assert "Confirming the password reset" in mail_kwargs["subject"]
    assert verification_link in mail_kwargs["message"]

    assert PasswordResetToken.objects.filter(user=users.user1).count() == test_case.expected_token_count


# ----- Test Send Verify Email ---------------------------------------------------------------------------------
@pytest.mark.django_db
@pytest.mark.parametrize("test_case", verify_email_test_case)
@patch("apps.user_auth.jwt_auth.tasks.EmailMultiAlternatives", name="email_class")
@patch("apps.user_auth.signals.delete_non_verified_user.apply_async", name="delete_non_verified_user")
def test_send_verify_email(mock_delete_non_verified_user, mock_email_class, users, test_case: VerifyEmail):
    # Create email object moc
    mock_email_instance = MagicMock()
    mock_email_class.return_value = mock_email_instance

    # Preparing data for the call
    mock_delete_non_verified_user.return_value.id = uuid.uuid4()
    VerificationCode.objects.create(user=users.user1)

    if not test_case.valid_code:
        VerificationCode.objects.filter(user=users.user1).update(expires_at=timezone.now() - timedelta(minutes=15))

    # Call the function
    result = send_verification_email.apply_async((users.user1.email,), queue="high_priority", priority=0)
    result.get()

    # Check that sending the email was triggered
    mock_email_instance.attach_alternative.assert_called_once()
    mock_email_instance.send.assert_called_once()

    # Check that the email object was created with the correct parameters
    code = VerificationCode.objects.filter(user=users.user1).first()
    mock_email_class.assert_called_once_with(
        subject="Підтвердження електронної пошти",
        body=f"Вітаю, {users.user1.username}! Ваш код підтвердження: {str(code)}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[users.user1.email],
    )

    attach_args, attach_kwargs = mock_email_instance.attach_alternative.call_args
    html_content = attach_args[0]

    assert str(code) in html_content
    assert VerificationCode.objects.filter(user=users.user1).count() == test_case.expected_token_count


# ----- Test Delete Non Verified User ----------------------------------------------------------------------------------
@pytest.mark.django_db
@pytest.mark.parametrize("test_case", delete_non_verified_user_test_case)
def test_delete_non_verified_user(users, test_case: VerifiedUser):
    user = getattr(users, test_case.user)
    user.is_email_verified = test_case.is_email_verified
    user.save()

    result = delete_non_verified_user.apply_async((user.id,), queue="low_priority", priority=0)
    result.get()

    query = User.objects.filter(id=user.id)
    assert query.exists() if user.is_email_verified else not query.exists()
