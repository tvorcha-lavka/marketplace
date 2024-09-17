from collections import namedtuple as nt
from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from apps.user_auth.models import PasswordResetToken

# ----- PasswordResetAPIView Test Case Schema --------------------------------------------------------------------------
R_TestCase = nt("PasswordReset", ["auth_user", "user_data", "expected_status", "expected_data"])
C_TestCase = nt("PasswordResetConfirm", ["auth_user", "user_data", "expected_status", "expected_data"])


# ----- PasswordResetAPIView Test Cases --------------------------------------------------------------------------------
password_reset_test_cases = [
    # "auth_user", "user_data", "expected_status", "expected_data"
    R_TestCase("admin", "valid_data", status.HTTP_200_OK, ["message"]),
    R_TestCase("user1", "valid_data", status.HTTP_403_FORBIDDEN, ["detail"]),
    R_TestCase("admin", "invalid_data", status.HTTP_404_NOT_FOUND, ["detail"]),
]
password_reset_confirm_test_cases = [
    # "auth_user", "user_data", "new_password", "expected_status", "expected_data"
    C_TestCase("admin", "valid_data", status.HTTP_200_OK, ["detail"]),
    C_TestCase("user1", "valid_data", status.HTTP_403_FORBIDDEN, ["detail"]),
    C_TestCase("admin", "invalid_data", status.HTTP_400_BAD_REQUEST, ["detail"]),
]


# ----- PasswordResetAPIView Tests -------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestPasswordResetAPIView:

    @pytest.fixture(autouse=True)
    def inject_fixtures(self, auth_client, users, user_data):
        self.auth_client = auth_client
        self.users = users
        self.reset_data = user_data.get("password_reset")
        self.confirm_data = user_data.get("password_reset_confirm")

    # ----- Reset ------------------------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", password_reset_test_cases)
    def test_password_reset_view(self, test_case: R_TestCase):
        client = self.get_testcase_client(test_case)

        url = reverse("password-reset")
        data = getattr(self.reset_data, test_case.user_data)
        response = client.post(url, data=data)

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

    # ----- Confirm ----------------------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", password_reset_confirm_test_cases)
    def test_password_reset_confirm_view(self, test_case: C_TestCase):
        client = self.get_testcase_client(test_case)

        if test_case.user_data == "valid_data":
            token = PasswordResetToken.objects.create(user=self.users.user1)
        else:
            token = PasswordResetToken.objects.create(user=self.users.user1)
            token.expires_at = timezone.now() - timedelta(minutes=20)
            token.save()

        url = reverse("password-reset-confirm")
        data = getattr(self.confirm_data, test_case.user_data)
        data.update({"token": str(token)})
        response = client.post(url, data=data)

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case):
        return self.auth_client(getattr(self.users, test_case.auth_user))
