import uuid
from collections import namedtuple
from datetime import timedelta
from unittest.mock import MagicMock, patch

import pytest
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from apps.user.models import User
from apps.user_auth.jwt_auth.tasks import (
    delete_non_used_code,
    delete_non_verified_user,
    remove_expired_tokens,
    send_reset_password,
    send_verify_email,
)
from apps.user_auth.models import CodeType, VerificationCode

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
VerifyCode = namedtuple("VerifyCodeTestCaseSchema", ["code_type", "re_request", "expected_code_count"])
VerifiedUser = namedtuple("VerifiedUserTestCaseSchema", ["user", "is_email_verified"])
ExpiredCode = namedtuple("ExpiredCodeTestCaseSchema", ["user", "is_expired"])


# ----- Test Cases -----------------------------------------------------------------------------------------------------
verification_code_test_case = [
    # "code_type", "re_request", "expected_code_count"
    VerifyCode(CodeType.EMAIL_VERIFICATION, False, 1),
    VerifyCode(CodeType.EMAIL_VERIFICATION, True, 1),
    VerifyCode(CodeType.RESET_PASSWORD, False, 1),
    VerifyCode(CodeType.RESET_PASSWORD, True, 1),
]

delete_non_verified_user_test_case = [
    # "user", "is_email_verified"
    VerifiedUser("user1", True),
    VerifiedUser("user1", False),
]

delete_non_used_code_test_case = [
    # "user", "is_expired"
    ExpiredCode("user1", True),
    ExpiredCode("user1", False),
]


# ----- Test Remove Expired Tokens -------------------------------------------------------------------------------------
@pytest.mark.django_db
def test_remove_expired_tokens(users):
    expires_at = timezone.now() - timedelta(days=1)

    def create_refresh_token(user):
        return OutstandingToken.objects.create(token=uuid.uuid4(), user=user, expires_at=expires_at)  # type: ignore

    def put_refresh_token_to_blacklist(token):
        BlacklistedToken.objects.create(token=token)  # type: ignore

    refresh_token = create_refresh_token(users.user1)
    put_refresh_token_to_blacklist(refresh_token)

    remove_expired_tokens.apply()

    assert not BlacklistedToken.objects.filter(id=refresh_token.id).exists()  # type: ignore
    assert not OutstandingToken.objects.filter(id=refresh_token.id).exists()  # type: ignore


# ----- Test Send Verification Code to Email ---------------------------------------------------------------------------
@pytest.mark.django_db
@pytest.mark.parametrize("test_case", verification_code_test_case)
@patch("apps.user_auth.jwt_auth.tasks.EmailMultiAlternatives", name="email_class")
@patch("apps.user_auth.signals.current_app.control.revoke", name="revoke_celery_task")
@patch("apps.user_auth.signals.delete_non_used_code.apply_async", name="delete_non_used_code")
@patch("apps.user_auth.signals.delete_non_verified_user.apply_async", name="delete_non_verified_user")
def test_send_verification_code_to_email(
    mock_delete_non_verified_user,
    mock_delete_non_used_code,
    mock_revoke_celery_task,
    mock_email_class,
    users,
    test_case: VerifyCode,
):
    # Create email object moc
    mock_email_instance = MagicMock()
    mock_email_class.return_value = mock_email_instance

    # Assign value to signals
    mock_delete_non_verified_user.return_value.id = uuid.uuid4()
    mock_delete_non_used_code.return_value.id = uuid.uuid4()

    # Preparing data for the call
    user = users.user1
    celery_tasks_map = {
        CodeType.EMAIL_VERIFICATION: send_verify_email,
        CodeType.RESET_PASSWORD: send_reset_password,
    }

    # Imitate that code exists
    if test_case.re_request:
        VerificationCode.objects.create(user=user, code_type=test_case.code_type)

    # -----------------------------------------------------------------------------------------------
    # Call the function
    result, message = celery_tasks_map[test_case.code_type](user)
    result.wait()

    # Get data from test
    code = VerificationCode.objects.filter(user=user).first()
    attach_args, attach_kwargs = mock_email_instance.attach_alternative.call_args
    html_content = attach_args[0]

    # -----------------------------------------------------------------------------------------------
    mock_email_instance.attach_alternative.assert_called_once()
    mock_email_instance.send.assert_called_once()
    mock_email_class.assert_called_once()

    if test_case.re_request:
        mock_revoke_celery_task.assert_called_once()

    assert str(code) in html_content
    assert VerificationCode.objects.filter(user=users.user1).count() == test_case.expected_code_count


# ----- Test Delete Non Verified User ----------------------------------------------------------------------------------
@pytest.mark.django_db
@pytest.mark.parametrize("test_case", delete_non_verified_user_test_case)
def test_delete_non_verified_user(users, test_case: VerifiedUser):
    user = getattr(users, test_case.user)
    user.is_email_verified = test_case.is_email_verified
    user.save()

    result = delete_non_verified_user.apply_async((user.id,), queue="low_priority", priority=0)
    result.wait()

    query = User.objects.filter(id=user.id)
    assert query.exists() if user.is_email_verified else not query.exists()


@pytest.mark.django_db
@pytest.mark.parametrize("test_case", delete_non_used_code_test_case)
@patch("apps.user_auth.signals.current_app.control.revoke", name="revoke_celery_task")
def test_delete_non_used_code(mock_revoke_task, users, verification_code_factory, test_case: ExpiredCode):
    user = getattr(users, test_case.user)
    code_obj = verification_code_factory.create(user, CodeType.RESET_PASSWORD)
    verification_code_factory.make_expired(code_obj) if test_case.is_expired else None

    result = delete_non_used_code.apply_async((code_obj.id,), queue="low_priority", priority=0)
    result.wait()

    query = VerificationCode.objects.filter(user=user)

    if test_case.is_expired:
        mock_revoke_task.assert_called_once()
        assert not query.exists()
    else:
        mock_revoke_task.assert_not_called()
        assert query.exists()
