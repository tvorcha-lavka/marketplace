from collections import namedtuple as nt
from typing import TypeAlias
from unittest.mock import MagicMock, patch

import pytest
from django.urls import reverse
from rest_framework import status

from apps.email.choices import EmailType
from apps.user_auth.models import VerificationCode
from core.tests.typing import APIClient, AuthClientType, CodeFactoryTuple, UsersTuple

# ----- PasswordRecoveryAPIView Test Case Schema -----------------------------------------------------------------------
R_TestCase = nt("R_TestCase", ["auth_user", "code", "expected_status", "expected_data"])
CaseType: TypeAlias = R_TestCase

# ----- PasswordRecoveryAPIView Test Cases -----------------------------------------------------------------------------
password_recovery_test_cases = [
    # "auth_user", "code", "expected_status", "expected_data"
    R_TestCase("user1", "valid_code", status.HTTP_200_OK, ["message"]),
    R_TestCase("user1", "invalid_code", status.HTTP_400_BAD_REQUEST, ["detail"]),
    R_TestCase("user1", "expired_code", status.HTTP_400_BAD_REQUEST, ["detail"]),
]


# ----- PasswordRecoveryAPIView Tests ----------------------------------------------------------------------------------
@pytest.mark.django_db
class TestPasswordRecoveryAPIView:
    @pytest.fixture(autouse=True)
    def setup(
        self,
        code_factory: CodeFactoryTuple,
        auth_client: AuthClientType,
        users: UsersTuple,
    ) -> None:
        self.code_factory = code_factory
        self.auth_client = auth_client
        self.users = users

    # ----- Recovery ---------------------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", password_recovery_test_cases)
    @patch("apps.user_auth.signals.app.control.revoke", name="revoke_celery_task")
    def test_password_recovery_view(self, mock_revoke_task: MagicMock, test_case: R_TestCase) -> None:
        code_obj = self.code_factory.create(self.users.user1.email, EmailType.PASSWORD_RECOVERY)

        if test_case.code == "invalid_code":
            self.code_factory.make_invalid(code_obj)
        elif test_case.code == "expired_code":
            self.code_factory.make_expired(code_obj)

        url = reverse("password-recovery")
        data = {"email": self.users.user1.email, "password": "#NewPassword123", "code": int(code_obj)}
        client = self.get_testcase_client(test_case)
        response = client.post(url, data=data)

        assert response.status_code == test_case.expected_status
        if test_case.expected_status == status.HTTP_200_OK:
            assert not VerificationCode.objects.filter(id=code_obj.id).exists()
            mock_revoke_task.assert_called_once()

        for key in test_case.expected_data:
            assert key in response.data

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case: CaseType) -> APIClient:
        return self.auth_client(getattr(self.users, test_case.auth_user))
