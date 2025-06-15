from collections import namedtuple
from typing import Any, Callable

import pytest
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from pytest_mock import MockerFixture

from apps.email.choices import EmailType
from apps.email.notifications import (
    notify_user_password_recovery,
    notify_user_successful_registration,
    notify_user_verify_email,
)
from apps.user_auth.models import VerificationCode
from core.tests.typing import UsersTuple

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
Code = namedtuple("Code", ["email_type", "re_request", "expected_code_count"])


# ----- Test Cases -----------------------------------------------------------------------------------------------------
verification_code_test_case = [
    # "email_type", "re_request", "expected_code_count"
    Code(EmailType.EMAIL_VERIFICATION, False, 1),
    Code(EmailType.EMAIL_VERIFICATION, True, 1),
    Code(EmailType.PASSWORD_RECOVERY, False, 1),
    Code(EmailType.PASSWORD_RECOVERY, True, 1),
]


@pytest.mark.django_db
@pytest.mark.usefixtures("celery_send_task_mocker")
class TestEmailTasks:

    @pytest.fixture(autouse=True)
    def setup(self, mocker: MockerFixture, users: UsersTuple) -> None:
        self.user = users.user1

        # Create email object moc
        self.email_instance = mocker.MagicMock()
        self.email_class = mocker.patch(
            "apps.email.tasks.EmailMultiAlternatives",
            return_value=self.email_instance,
        )

    # ----- Test Send Verification Code Message ------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", verification_code_test_case)
    def test_send_verification_code_task(self, mocker: MockerFixture, test_case: Code) -> None:
        # Mock signals
        mock_post_save = mocker.patch("django.db.models.signals.post_save.send")
        mock_post_delete = mocker.patch("django.db.models.signals.post_delete.send")

        # Preparing data for the call
        notify_func_map: dict[EmailType, Callable[..., Any]] = {
            EmailType.EMAIL_VERIFICATION: notify_user_verify_email,
            EmailType.PASSWORD_RECOVERY: notify_user_password_recovery,
        }

        subject_map: dict[EmailType, str] = {
            EmailType.EMAIL_VERIFICATION: str(_("Email verification")),
            EmailType.PASSWORD_RECOVERY: str(_("Password recovery")),
        }

        body_map: dict[EmailType, str] = {
            EmailType.EMAIL_VERIFICATION: str(_("Hi! Your email verification code: <VERIFICATION_CODE>")),
            EmailType.PASSWORD_RECOVERY: str(_("Hi! Your password recovery code: <VERIFICATION_CODE>")),
        }

        # Imitate that code exists
        if test_case.re_request:
            VerificationCode.objects.create(email=self.user.email, email_type=test_case.email_type)

        # -----------------------------------------------------------------------------------------------
        # Call the function
        notify_func_map[test_case.email_type](email=self.user.email)

        # Get data from test
        code = VerificationCode.objects.filter(email=self.user.email).first()
        attach_args, attach_kwargs = self.email_instance.attach_alternative.call_args
        html_content = attach_args[0]

        # Assert results
        self.email_instance.attach_alternative.assert_called_once()
        self.email_instance.send.assert_called_once_with()
        self.email_class.assert_called_once_with(
            subject=subject_map[test_case.email_type],
            body=body_map[test_case.email_type].replace("<VERIFICATION_CODE>", str(code)),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[self.user.email],
        )

        if not test_case.re_request:
            mock_post_delete.assert_not_called()
            mock_post_save.assert_called_once()

        if test_case.re_request:
            mock_post_delete.assert_called_once()
            assert mock_post_save.call_count == 2

        assert str(code) in html_content
        assert VerificationCode.objects.filter(email=self.user.email).count() == test_case.expected_code_count

    # ----- Test Send Welcome Message ----------------------------------------------------------------------------------
    def test_send_welcome_email_task(self) -> None:
        # Call the function
        notify_user_successful_registration(email=self.user.email)

        subject = str(_("Welcome to Tvorcha Lavka!"))
        body = str(_("Hi! Thank you for registering on Tvorcha Lavka!"))

        # Get data from test
        attach_args, attach_kwargs = self.email_instance.attach_alternative.call_args
        html_content = attach_args[0]

        # Assert results
        assert str(_("Welcome to Tvorcha Lavka!")) in html_content

        self.email_instance.attach_alternative.assert_called_once()
        self.email_instance.send.assert_called_once()
        self.email_class.assert_called_once_with(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[self.user.email],
        )
