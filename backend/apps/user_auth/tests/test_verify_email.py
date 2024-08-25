import uuid
from collections import namedtuple as nt
from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from apps.user_auth.models import EmailVerificationToken

# ----- VerifyEmailAPIView Test Case Schema ----------------------------------------------------------------------------
V_TestCase = nt("VerifyEmail", ["auth_user", "token", "expected_status", "expected_data"])

# ----- VerifyEmailAPIView Test Cases ----------------------------------------------------------------------------------
verify_email_test_cases = [
    # "auth_user", "token", "expected_status", "expected_data"
    V_TestCase("admin", "valid_token", status.HTTP_200_OK, ["detail", "user", "access", "refresh"]),
    V_TestCase("admin", "invalid_token", status.HTTP_404_NOT_FOUND, ["detail"]),
    V_TestCase("admin", "expired_token", status.HTTP_400_BAD_REQUEST, ["detail"]),
    V_TestCase("user1", "valid_token", status.HTTP_403_FORBIDDEN, ["detail"]),
]


# ----- VerifyEmailAPIView Tests ---------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestVerifyEmailAPIView:
    @pytest.fixture(autouse=True)
    def inject_fixtures(self, auth_client, users):
        self.auth_client = auth_client
        self.users = users

    @pytest.mark.parametrize("test_case", verify_email_test_cases)
    def test_verify_email_view(self, test_case: V_TestCase):
        client = self.get_testcase_client(test_case)
        token = EmailVerificationToken.objects.create(user=self.users.user1)

        if test_case.token == "invalid_token":
            token.token = uuid.uuid4()
        elif test_case.token == "expired_token":
            token.expires_at = timezone.now() - timedelta(days=2)
            token.save()

        url = reverse("verify-email")
        response = client.post(url, data={"token": token.token})

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case):
        return self.auth_client(getattr(self.users, test_case.auth_user))
