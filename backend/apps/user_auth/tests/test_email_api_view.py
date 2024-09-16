from collections import namedtuple as nt
from unittest.mock import patch

import pytest
from django.urls import reverse
from rest_framework import status

from apps.user_auth.jwt_auth.views import EmailAPIView

# ----- EmailAPIView Test Case Schema ----------------------------------------------------------------------------------
E_TestCase = nt("Email", ["auth_user", "url_name", "expected_status", "expected_data"])

# ----- EmailAPIView Test Cases ----------------------------------------------------------------------------------------
send_email_test_cases = [
    # "auth_user", "url_name", "user_data", "expected_status", "expected_data"
    E_TestCase("admin", "send-email-verification-code", status.HTTP_200_OK, ["message"]),
    E_TestCase("user1", "send-email-verification-code", status.HTTP_403_FORBIDDEN, ["detail"]),
    E_TestCase("admin", "send-reset-password-code", status.HTTP_200_OK, ["message"]),
    E_TestCase("user1", "send-reset-password-code", status.HTTP_403_FORBIDDEN, ["detail"]),
]


# ----- EmailAPIView Tests ---------------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestEmailAPIView:
    @pytest.fixture(autouse=True)
    def inject_fixtures(self, auth_client, users, user_data):
        self.auth_client = auth_client
        self.users = users

    @pytest.mark.parametrize("test_case", send_email_test_cases)
    @patch("apps.user_auth.jwt_auth.tasks.send_verification_code.apply_async")
    def test_send_email(self, mock_email_task, test_case: E_TestCase):
        client = self.get_testcase_client(test_case)

        url = reverse(test_case.url_name)
        data = {"email": self.users.user1.email}
        response = client.post(url, data=data)

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

        if response.status_code == status.HTTP_200_OK:
            mock_email_task.assert_called_once()

    def test_no_implemented_perform_action(self):
        view = EmailAPIView()

        with pytest.raises(NotImplementedError):
            view.perform_action(self.users.user1)

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case):
        return self.auth_client(getattr(self.users, test_case.auth_user))
