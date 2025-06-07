from collections import namedtuple as nt
from typing import TypeAlias
from unittest.mock import MagicMock, patch

import pytest
from django.urls import reverse
from rest_framework import status

from core.tests.typing import APIClient, AuthClientType, UsersTuple

# ----- EmailAPIView Test Case Schema ----------------------------------------------------------------------------------
E_TestCase = nt("E_TestCase", ["auth_user", "url_name", "has_cache", "expected_status", "expected_data"])
CaseType: TypeAlias = E_TestCase

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
    def setup(self, auth_client: AuthClientType, users: UsersTuple) -> None:
        self.auth_client = auth_client
        self.users = users

    @pytest.mark.parametrize("test_case", send_email_test_cases)
    @patch("apps.email.tasks.send_verification_code_task.apply_async")
    @patch("apps.user_auth.jwt.redis.cache.get")
    def test_send_email(self, mock_redis_cache: MagicMock, mock_email_task: MagicMock, test_case: E_TestCase) -> None:
        client = self.get_testcase_client(test_case)

        url = reverse(test_case.url_name)
        data = {"email": self.users.user1.email}
        mock_redis_cache.return_value = data if test_case.has_cache else None

        response = client.post(url, data=data)

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

        mock_email_task.assert_called_once()

    def test_send_email_verification_code_to_verified_user(self) -> None:
        client = self.auth_client(self.users.admin)
        user = self.users.user1
        user.verify_email()

        url = reverse("send-email-verification-code")
        data = {"email": self.users.user1.email}
        response = client.post(url, data=data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case: CaseType) -> APIClient:
        return self.auth_client(getattr(self.users, test_case.auth_user))
