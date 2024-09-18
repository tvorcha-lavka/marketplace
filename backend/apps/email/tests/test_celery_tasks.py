from collections import namedtuple
from unittest.mock import MagicMock, patch

import pytest

from apps.email.tasks import send_reset_password, send_verify_email
from apps.user_auth.models import CodeType, VerificationCode

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
Code = namedtuple("VerifyCodeTestCaseSchema", ["code_type", "re_request", "expected_code_count"])


# ----- Test Cases -----------------------------------------------------------------------------------------------------
verification_code_test_case = [
    # "code_type", "re_request", "expected_code_count"
    Code(CodeType.EMAIL_VERIFICATION, False, 1),
    Code(CodeType.EMAIL_VERIFICATION, True, 1),
    Code(CodeType.RESET_PASSWORD, False, 1),
    Code(CodeType.RESET_PASSWORD, True, 1),
]


# ----- Test Send Verification Code to Email ---------------------------------------------------------------------------
@pytest.mark.django_db
@pytest.mark.parametrize("test_case", verification_code_test_case)
@patch("apps.email.tasks.EmailMultiAlternatives", name="email_class")
@patch("django.db.models.signals.pre_delete.send", autospec=True)
@patch("apps.user_auth.models.VerificationCode.post_save", autospec=True)
def test_send_verification_code_to_email(mock_post_save, mock_pre_delete, mock_email_class, users, test_case: Code):
    # Create email object moc
    mock_email_instance = MagicMock()
    mock_email_class.return_value = mock_email_instance

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

    if not test_case.re_request:
        mock_pre_delete.assert_not_called()
        mock_post_save.assert_called_once()

    if test_case.re_request:
        mock_pre_delete.assert_called_once()
        assert mock_post_save.call_count == 2

    assert str(code) in html_content
    assert VerificationCode.objects.filter(user=users.user1).count() == test_case.expected_code_count
