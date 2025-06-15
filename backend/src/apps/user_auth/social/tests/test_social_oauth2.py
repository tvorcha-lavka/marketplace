from collections import namedtuple as nt
from typing import Any, TypeAlias

import pytest
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework import status

from apps.user.models import User
from core.tests.typing import APIClient, AuthClientType, UsersTuple, ValidOrInvalidDataTuple

# ----- SocialOAuth2 Test Case Schemas ---------------------------------------------------------------------------------
R_TestCase = nt("R_TestCase", ["auth_user", "social", "expected_status", "expected_data"])
C_TestCase = nt(
    "C_TestCase",
    ["auth_user", "social", "user_data", "is_active", "is_email_verified", "expected_status", "expected_data"],
)
CaseType: TypeAlias = R_TestCase | C_TestCase

# ----- SocialOAuth2 Test Cases ----------------------------------------------------------------------------------------
social_oauth2_redirect_test_cases = [
    # "auth_user", "social", "expected_status", "expected_data"
    R_TestCase("user1", "google", status.HTTP_200_OK, ["auth_url"]),
    R_TestCase("user1", "facebook", status.HTTP_200_OK, ["auth_url"]),
]
social_oauth2_callback_test_cases = [
    # "auth_user", "social", "user_data", "is_active", "is_email_verified", "expected_status", "expected_data"
    C_TestCase("user1", "google", "valid_data", True, True, status.HTTP_200_OK, ["user", "token"]),
    C_TestCase("user1", "google", "valid_data", True, False, status.HTTP_200_OK, ["user", "token"]),
    C_TestCase("user1", "google", "invalid_data", None, None, status.HTTP_400_BAD_REQUEST, ["detail"]),
    C_TestCase("user1", "google", "valid_data", False, True, status.HTTP_403_FORBIDDEN, ["detail"]),
    C_TestCase("user1", "facebook", "valid_data", True, True, status.HTTP_200_OK, ["user", "token"]),
    C_TestCase("user1", "facebook", "valid_data", True, False, status.HTTP_200_OK, ["user", "token"]),
    C_TestCase("user1", "facebook", "invalid_data", None, None, status.HTTP_400_BAD_REQUEST, ["detail"]),
    C_TestCase("user1", "facebook", "valid_data", False, False, status.HTTP_403_FORBIDDEN, ["detail"]),
]


# ----- SocialOAuth2 Tests ---------------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestSocialOAuth2:

    model = User

    @pytest.fixture(autouse=True)
    def setup(self, auth_client: AuthClientType, users: UsersTuple, data: ValidOrInvalidDataTuple) -> None:
        self.auth_client = auth_client
        self.users = users
        self.data = data

    # ----- Social OAuth2 Redirect View --------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", social_oauth2_redirect_test_cases)
    def test_social_oauth2_redirect_view(self, test_case: R_TestCase) -> None:
        client = self.get_testcase_client(test_case)

        response = client.get(reverse(f"{test_case.social}-login"))
        response_data = response.data  # noqa

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response_data

    # ----- Social OAuth2 Callback View --------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", social_oauth2_callback_test_cases)
    def test_social_oauth2_callback_view(self, mocker: MockerFixture, test_case: C_TestCase) -> None:
        # Mock backend complete method
        mock_load_backend = mocker.patch("apps.user_auth.social.mixins.load_backend")
        mock_load_backend.return_value.complete.side_effect = lambda: self.mock_complete(test_case)

        # Mock notify user method
        mock_send_email = mocker.patch("apps.user_auth.social.views.notify_user_successful_registration")

        url = reverse(f"{test_case.social}-login-complete")
        data: dict[str, Any] = getattr(self.data, test_case.user_data)
        client = self.get_testcase_client(test_case)

        response = client.post(url, data=data)
        response_data = response.data  # noqa

        if test_case.is_email_verified is False:
            mock_send_email.assert_called_once()

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response_data

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case: CaseType) -> APIClient:
        return self.auth_client(getattr(self.users, test_case.auth_user))

    def mock_complete(self, testcase: C_TestCase) -> User:
        if testcase.user_data == "invalid_data":
            raise Exception("Authentication failed")

        return self.model.objects.create(
            email="user@example.com",
            username="test_user",
            password="#TestPassword123",
            is_active=testcase.is_active,
            is_email_verified=testcase.is_email_verified,
        )
