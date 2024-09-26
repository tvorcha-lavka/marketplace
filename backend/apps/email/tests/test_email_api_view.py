from collections import namedtuple as nt
from unittest.mock import patch

import pytest
from django.urls import reverse
from rest_framework import status

# ----- EmailAPIView Test Case Schema ----------------------------------------------------------------------------------
E_TestCase = nt("Email", ["auth_user", "url_name", "has_cache", "expected_status", "expected_data"])

# ----- EmailAPIView Test Cases ----------------------------------------------------------------------------------------
send_email_test_cases = [
    # "auth_user", "url_name", "user_data", "has_cache", "expected_status", "expected_data"
    E_TestCase("admin", "send-email-verification-code", True, status.HTTP_200_OK, ["email", "message"]),
    E_TestCase("admin", "send-email-verification-code", False, status.HTTP_200_OK, ["email", "message"]),
    E_TestCase("user1", "send-email-verification-code", False, status.HTTP_200_OK, ["email", "message"]),
    E_TestCase("admin", "send-reset-password-code", None, status.HTTP_200_OK, ["email", "message"]),
    E_TestCase("user1", "send-reset-password-code", None, status.HTTP_200_OK, ["email", "message"]),
]


# ----- EmailAPIView Tests ---------------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestEmailAPIView:
    @pytest.fixture(autouse=True)
    def inject_fixtures(self, auth_client, users):
        self.auth_client = auth_client
        self.users = users

    @pytest.mark.parametrize("test_case", send_email_test_cases)
    @patch("apps.email.tasks.send_verification_code.apply_async")
    @patch("apps.user_auth.jwt.redis.cache.get")
    def test_send_email(self, mock_redis_cache, mock_email_task, test_case: E_TestCase):
        client = self.get_testcase_client(test_case)

        url = reverse(test_case.url_name)
        data = {"email": self.users.user1.email}
        mock_redis_cache.return_value = data if test_case.has_cache else None

        response = client.post(url, data=data)

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

        mock_email_task.assert_called_once()

    def test_send_email_verification_code_to_verified_user(self):
        client = self.auth_client(self.users.admin)
        user = self.users.user1
        user.verify_email()

        url = reverse("send-email-verification-code")
        data = {"email": self.users.user1.email}
        response = client.post(url, data=data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case):
        return self.auth_client(getattr(self.users, test_case.auth_user))
