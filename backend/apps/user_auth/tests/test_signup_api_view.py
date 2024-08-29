from collections import namedtuple as nt
from unittest.mock import patch

import pytest
from django.urls import reverse
from rest_framework import status

from apps.user_auth.models import User

from .conftest import UserSchema

# ----- SignupAPIView Test Case Schema ---------------------------------------------------------------------------------
S_TestCase = nt("SignupTestCase", ["auth_user", "data", "expected_status", "expected_data"])

# ----- SignupAPIView Test Cases ---------------------------------------------------------------------------------------
signup_test_cases = [
    # "auth_user", "data", "expected_status", "expected_data"
    S_TestCase("admin", "valid_data", status.HTTP_201_CREATED, ["email", "message"]),
    S_TestCase("not_auth", "valid_data", status.HTTP_201_CREATED, ["email", "message"]),
    S_TestCase("not_auth", "invalid_data", status.HTTP_400_BAD_REQUEST, ["non_field_errors"]),
    S_TestCase("user1", "invalid_data", status.HTTP_403_FORBIDDEN, ["detail"]),
    S_TestCase("user2", "valid_data", status.HTTP_403_FORBIDDEN, ["detail"]),
]


# ----- SignupAPIView Tests --------------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestSignupAPIView:
    @pytest.fixture(autouse=True)
    def inject_fixtures(self, auth_client, users, user_data):
        self.auth_client = auth_client
        self.users: UserSchema = users
        self.data = user_data.get("signup")

    @pytest.mark.parametrize("test_case", signup_test_cases)
    @patch("apps.user_auth.jwt_auth.views.send_verification_email.apply_async")
    def test_signup_view(self, send_verification_email, test_case: S_TestCase):
        client = self.get_testcase_client(test_case)

        url = reverse("sign-up")
        data = getattr(self.data, test_case.data)
        response = client.post(url, data=data)

        assert response.status_code == test_case.expected_status

        for key in test_case.expected_data:
            assert key in response.data

        if test_case.expected_status == status.HTTP_201_CREATED:
            send_verification_email.assert_called_once_with((data.get("email"),), queue="high_priority", priority=0)
            assert User.objects.filter(email=data.get("email")).exists()

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case):
        return self.auth_client(getattr(self.users, test_case.auth_user))
