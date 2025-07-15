from collections import namedtuple as nt
from typing import TypeAlias

import pytest
from django.core.cache import cache
from django.db.models.signals import post_delete
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework import status

from apps.email.choices import EmailType
from apps.user.models import User
from apps.user_auth.jwt.redis import save_temporary_signup_data
from apps.user_auth.models import VerificationCode
from core.tests.typing import APIClient, AuthClientType, CodeFactoryTuple, UsersTuple, ValidOrInvalidUserDataType

# ----- SignupAPIView Test Case Schema ---------------------------------------------------------------------------------
S_TestCase = nt("S_TestCase", ["auth_user", "data", "re_request", "expected_status", "expected_data"])
C_TestCase = nt("C_TestCase", ["auth_user", "code", "cache_data_exists", "expected_status", "expected_data"])

CaseType: TypeAlias = S_TestCase | C_TestCase

# ----- SignupAPIView Test Cases ---------------------------------------------------------------------------------------
signup_test_cases = [
    # "auth_user", "data", "re_request", "expected_status", "expected_data"
    S_TestCase("user1", "valid_data", False, status.HTTP_200_OK, ["email", "message"]),
    S_TestCase("user1", "valid_data", True, status.HTTP_307_TEMPORARY_REDIRECT, ["message"]),
    S_TestCase("user1", "invalid_data", False, status.HTTP_400_BAD_REQUEST, ["password"]),
]
signup_complete_test_cases = [
    # "auth_user", "code", "cache_data_exists", "expected_status", "expected_data"
    C_TestCase("user1", "valid_code", True, status.HTTP_201_CREATED, ["user", "token"]),
    C_TestCase("user1", "valid_code", False, status.HTTP_400_BAD_REQUEST, ["detail"]),
    C_TestCase("user1", "invalid_code", False, status.HTTP_400_BAD_REQUEST, ["detail"]),
    C_TestCase("user1", "expired_code", False, status.HTTP_400_BAD_REQUEST, ["detail"]),
]


# ----- SignupAPIView Tests --------------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestSignupAPIView:
    @pytest.fixture(autouse=True)
    def setup(
        self,
        user_data: ValidOrInvalidUserDataType,
        code_factory: CodeFactoryTuple,
        auth_client: AuthClientType,
        users: UsersTuple,
    ) -> None:
        self.code_factory = code_factory
        self.data = user_data["signup"]
        self.auth_client = auth_client
        self.users = users

    @pytest.mark.parametrize("test_case", signup_test_cases)
    def test_signup_view(self, mocker: MockerFixture, test_case: S_TestCase) -> None:
        client = self.get_testcase_client(test_case)
        cache.clear() if not test_case.re_request else None

        # Mock notify user method
        mock_notify = mocker.patch(
            "apps.user_auth.jwt.views.notify_user_verify_email",
            return_value="Message",
        )

        url = reverse("sign-up")
        data = getattr(self.data, test_case.data)

        response = client.post(url, data=data)

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

        if test_case.expected_status == status.HTTP_200_OK:
            mock_notify.assert_called_once_with(data["email"])

    @pytest.mark.parametrize("test_case", signup_complete_test_cases)
    def test_signup_complete_view(self, mocker: MockerFixture, test_case: C_TestCase) -> None:
        client = self.get_testcase_client(test_case)
        email = self.data.valid_data["email"]

        # Mock signal on post delete VerificationCode and notify user method
        mock_post_delete = mocker.patch.object(post_delete, "send", autospec=True)
        mock_notify = mocker.patch("apps.user_auth.jwt.views.notify_user_successful_registration")

        # imitate that first step of signup is complete and verification code exists
        code_obj = self.code_factory.create(email, EmailType.EMAIL_VERIFICATION)

        if test_case.cache_data_exists:
            save_temporary_signup_data(email, self.data.valid_data)

        if test_case.code == "invalid_code":
            self.code_factory.make_invalid(code_obj)
        elif test_case.code == "expired_code":
            self.code_factory.make_expired(code_obj)

        url = reverse("sign-up-complete")
        data = {"email": email, "code": int(code_obj)}

        response = client.post(url, data=data)
        cache.clear()

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

        if response.status_code == status.HTTP_201_CREATED:
            assert User.objects.filter(email=email).exists()

            mock_notify.assert_called_once_with(email)
            mock_post_delete.assert_called_once()

            assert not VerificationCode.objects.filter(email=email).exists()

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case: CaseType) -> APIClient:
        return self.auth_client(getattr(self.users, test_case.auth_user))
