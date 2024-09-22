from collections import namedtuple as nt
from unittest.mock import patch

import pytest
from django.urls import reverse
from rest_framework import status

from apps.email.models import EmailType
from apps.user_auth.models import VerificationCode

# ----- ResetPasswordAPIView Test Case Schema --------------------------------------------------------------------------
R_TestCase = nt("PasswordReset", ["auth_user", "code", "expected_status", "expected_data"])

# ----- ResetPasswordAPIView Test Cases --------------------------------------------------------------------------------
password_reset_test_cases = [
    # "auth_user", "code", "expected_status", "expected_data"
    R_TestCase("admin", "valid_code", status.HTTP_200_OK, ["message"]),
    R_TestCase("admin", "invalid_code", status.HTTP_400_BAD_REQUEST, ["detail"]),
    R_TestCase("admin", "expired_code", status.HTTP_400_BAD_REQUEST, ["detail"]),
    R_TestCase("user1", "valid_code", status.HTTP_403_FORBIDDEN, ["detail"]),
]


# ----- ResetPasswordAPIView Tests -------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestResetPasswordAPIView:
    @pytest.fixture(autouse=True)
    def inject_fixtures(self, auth_client, users, code_factory):
        self.auth_client = auth_client
        self.users = users
        self.code_factory = code_factory

    # ----- Reset ------------------------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", password_reset_test_cases)
    @patch("apps.user_auth.signals.current_app.control.revoke", name="revoke_celery_task")
    def test_reset_password_view(self, mock_revoke_task, test_case: R_TestCase):
        code_obj = self.code_factory.create(self.users.user1.email, EmailType.RESET_PASSWORD)

        if test_case.code == "invalid_code":
            self.code_factory.make_invalid(code_obj)
        elif test_case.code == "expired_code":
            self.code_factory.make_expired(code_obj)

        url = reverse("reset-password")
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
    def get_testcase_client(self, test_case):
        return self.auth_client(getattr(self.users, test_case.auth_user))
