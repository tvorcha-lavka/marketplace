from collections import namedtuple as nt
from unittest.mock import patch

import pytest
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status

from apps.email.models import EmailType
from apps.user.models import User

from ...models import VerificationCode
from ..redis import save_temporary_signup_data
from .conftest import UserSchema

# ----- SignupAPIView Test Case Schema ---------------------------------------------------------------------------------
S_TestCase = nt("SignupTestCase", ["auth_user", "data", "re_request", "expected_status", "expected_data"])
C_TestCase = nt("SignupCompleteTestCase", ["auth_user", "code", "expected_status", "expected_data"])

# ----- SignupAPIView Test Cases ---------------------------------------------------------------------------------------
signup_test_cases = [
    # "auth_user", "data", "re_request", "expected_status", "expected_data"
    S_TestCase("admin", "valid_data", False, status.HTTP_200_OK, ["email", "message"]),
    S_TestCase("admin", "valid_data", True, status.HTTP_307_TEMPORARY_REDIRECT, ["message"]),
    S_TestCase("admin", "invalid_data", False, status.HTTP_400_BAD_REQUEST, ["password"]),
    S_TestCase("not_auth", "valid_data", False, status.HTTP_401_UNAUTHORIZED, ["detail"]),
    S_TestCase("user1", "valid_data", False, status.HTTP_403_FORBIDDEN, ["detail"]),
]
signup_complete_test_cases = [
    # "auth_user", "code", "expected_status", "expected_data"
    C_TestCase("admin", "valid_code", status.HTTP_201_CREATED, ["user", "token"]),
    C_TestCase("admin", "invalid_code", status.HTTP_400_BAD_REQUEST, ["detail"]),
    C_TestCase("admin", "expired_code", status.HTTP_400_BAD_REQUEST, ["detail"]),
    C_TestCase("not_auth", "valid_code", status.HTTP_401_UNAUTHORIZED, ["detail"]),
    C_TestCase("user1", "valid_code", status.HTTP_403_FORBIDDEN, ["detail"]),
]


# ----- SignupAPIView Tests --------------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestSignupAPIView:
    @pytest.fixture(autouse=True)
    def inject_fixtures(self, auth_client, users, user_data, code_factory):
        self.auth_client = auth_client
        self.users: UserSchema = users
        self.data = user_data.get("signup")
        self.code_factory = code_factory

    @pytest.mark.parametrize("test_case", signup_test_cases)
    @patch("apps.email.tasks.send_verification_code.apply_async")
    def test_signup_view(self, mock_email_task, test_case: S_TestCase):
        client = self.get_testcase_client(test_case)
        cache.clear() if not test_case.re_request else None

        url = reverse("sign-up")
        data = getattr(self.data, test_case.data)
        response = client.post(url, data=data)

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

        if test_case.expected_status == status.HTTP_200_OK:
            mock_email_task.assert_called_once()

    @pytest.mark.parametrize("test_case", signup_complete_test_cases)
    @patch("django.db.models.signals.post_delete.send", autospec=True)
    def test_signup_complete_view(self, mock_post_delete, test_case: C_TestCase):
        client = self.get_testcase_client(test_case)
        email = self.data.valid_data.get("email")

        # imitate that first step of signup is complete and verification code exists
        code_obj = self.code_factory.create(email, EmailType.EMAIL_VERIFICATION)
        save_temporary_signup_data(email, self.data.valid_data)

        if test_case.code == "invalid_code":
            self.code_factory.make_invalid(code_obj)
        elif test_case.code == "expired_code":
            self.code_factory.make_expired(code_obj)

        url = reverse("sign-up-complete")
        data = {"email": email, "code": int(code_obj)}
        response = client.post(url, data=data)

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

        if response.status_code == status.HTTP_201_CREATED:
            assert User.objects.filter(email=email).exists()

            mock_post_delete.assert_called_once()
            assert not VerificationCode.objects.filter(email=email).exists()

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case):
        return self.auth_client(getattr(self.users, test_case.auth_user))
