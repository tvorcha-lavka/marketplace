from collections import namedtuple as nt
from typing import TypeAlias

import pytest
from django.urls import reverse
from rest_framework import status

from core.tests.typing import APIClient, AuthClientType, UsersTuple, ValidOrInvalidUserDataType

# ----- LoginAPIView Test Case Schema ----------------------------------------------------------------------------------
L_TestCase = nt("L_TestCase", ["auth_user", "data", "is_email_verified", "expected_status", "expected_data"])
CaseType: TypeAlias = L_TestCase

# ----- LoginAPIView Test Cases ----------------------------------------------------------------------------------------
login_test_cases = [
    # "auth_user", "data", "is_email_verified", "expected_status", "expected_data"
    L_TestCase("user1", "valid_data", True, status.HTTP_200_OK, ["access", "refresh"]),
    L_TestCase("user1", "invalid_data", True, status.HTTP_401_UNAUTHORIZED, ["detail"]),
    L_TestCase("user1", "valid_data", False, status.HTTP_403_FORBIDDEN, ["detail"]),
]


# ----- LoginAPIView Tests ---------------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestLoginAPIView:
    @pytest.fixture(autouse=True)
    def setup(self, auth_client: AuthClientType, users: UsersTuple, user_data: ValidOrInvalidUserDataType) -> None:
        self.auth_client = auth_client
        self.users = users
        self.data = user_data.get("login")

    @pytest.mark.parametrize("test_case", login_test_cases)
    def test_login_api_view(self, test_case: L_TestCase) -> None:
        user = getattr(self.users, test_case.auth_user)

        if test_case.is_email_verified:
            user.verify_email()

        client = self.get_testcase_client(test_case)

        url = reverse("login")
        data = getattr(self.data, test_case.data)
        response = client.post(url, data=data)

        assert response.status_code == test_case.expected_status

        for key in test_case.expected_data:
            assert key in response.data

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case: CaseType) -> APIClient:
        return self.auth_client(getattr(self.users, test_case.auth_user))
