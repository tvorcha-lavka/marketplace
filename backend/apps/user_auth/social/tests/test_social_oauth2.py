from collections import namedtuple as nt
from unittest.mock import patch

import pytest
from django.urls import reverse
from rest_framework import status

from apps.user.models import User

from .conftest import DataType, UserSchema

# ----- SocialOAuth2 Test Case Schemas ---------------------------------------------------------------------------------
R_TestCase = nt("RedirectView", ["auth_user", "social", "expected_status", "expected_data"])
C_TestCase = nt(
    "CallbackView",
    ["auth_user", "social", "user_data", "is_active", "is_email_verified", "expected_status", "expected_data"],
)

# ----- SocialOAuth2 Test Cases ----------------------------------------------------------------------------------------
social_oauth2_redirect_test_cases = [
    # "auth_user", "social", "expected_status", "expected_data"
    R_TestCase("admin", "google", status.HTTP_200_OK, ["auth_url"]),
    R_TestCase("user1", "google", status.HTTP_403_FORBIDDEN, ["detail"]),
    R_TestCase("admin", "facebook", status.HTTP_200_OK, ["auth_url"]),
    R_TestCase("user1", "facebook", status.HTTP_403_FORBIDDEN, ["detail"]),
]
social_oauth2_callback_test_cases = [
    # "auth_user", "social", "user_data", "is_active", "is_email_verified", "expected_status", "expected_data"
    C_TestCase("admin", "google", "valid_data", True, True, status.HTTP_200_OK, ["user", "token"]),
    C_TestCase("admin", "google", "valid_data", True, False, status.HTTP_200_OK, ["user", "token"]),
    C_TestCase("admin", "google", "invalid_data", None, None, status.HTTP_400_BAD_REQUEST, ["detail"]),
    C_TestCase("admin", "google", "valid_data", False, True, status.HTTP_403_FORBIDDEN, ["detail"]),
    C_TestCase("user1", "google", "valid_data", True, True, status.HTTP_403_FORBIDDEN, ["detail"]),
    C_TestCase("admin", "facebook", "valid_data", True, True, status.HTTP_200_OK, ["user", "token"]),
    C_TestCase("admin", "facebook", "valid_data", True, False, status.HTTP_200_OK, ["user", "token"]),
    C_TestCase("admin", "facebook", "invalid_data", None, None, status.HTTP_400_BAD_REQUEST, ["detail"]),
    C_TestCase("admin", "facebook", "valid_data", False, False, status.HTTP_403_FORBIDDEN, ["detail"]),
    C_TestCase("user1", "facebook", "valid_data", True, True, status.HTTP_403_FORBIDDEN, ["detail"]),
]


# ----- SocialOAuth2 Tests ---------------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestSocialOAuth2:

    model = User

    @pytest.fixture(autouse=True)
    def inject_fixtures(self, auth_client, users, data):
        self.auth_client = auth_client
        self.users: UserSchema = users
        self.data: DataType = data

    # ----- Social OAuth2 Redirect View --------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", social_oauth2_redirect_test_cases)
    def test_social_oauth2_redirect_view(self, test_case: R_TestCase):
        client = self.get_testcase_client(test_case.auth_user)
        response = client.get(reverse(f"{test_case.social}-login"))

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

    # ----- Social OAuth2 Callback View --------------------------------------------------------------------------------
    @patch("apps.email.tasks.send_mail")
    @patch("apps.user_auth.social.mixins.load_backend")
    @pytest.mark.parametrize("test_case", social_oauth2_callback_test_cases)
    def test_social_oauth2_callback_view(self, mock_load_backend, mock_send_email, test_case: C_TestCase):
        mock_load_backend.return_value.complete.side_effect = lambda: self.mock_complete(test_case)

        url = reverse(f"{test_case.social}-login-complete")
        data = getattr(self.data, test_case.user_data)
        client = self.get_testcase_client(test_case.auth_user)

        response = client.post(url, data=data)

        if test_case.is_email_verified is False:
            mock_send_email.assert_called_once()

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, auth_user):
        return self.auth_client(getattr(self.users, auth_user))

    def mock_complete(self, testcase):
        if testcase.user_data == "invalid_data":
            raise Exception("Authentication failed")

        return self.model.objects.create(
            email="user@example.com",
            username="test_user",
            password="#TestPassword123",
            is_active=testcase.is_active,
            is_email_verified=testcase.is_email_verified,
        )
