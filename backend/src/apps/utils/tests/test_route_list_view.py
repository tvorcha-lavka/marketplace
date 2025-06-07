from collections import namedtuple as nt
from typing import TypeAlias

import pytest
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status

from core.tests.typing import APIClient, AuthClientType, UsersTuple

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
L_TestCase = nt("L_TestCase", ["auth_user", "expected_status", "expected_data"])
CaseType: TypeAlias = L_TestCase


# ----- Test Cases ----------------------------------------------------------------------------------------
route_list_view_test_cases = [
    # "auth_user", "expected_status", "expected_data"
    L_TestCase("admin", status.HTTP_200_OK, dict),
    L_TestCase("user1", status.HTTP_403_FORBIDDEN, ["detail"]),
]


# ----- Route List View Tests ------------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestRouteListView:
    @pytest.fixture(autouse=True)
    def setup(self, auth_client: AuthClientType, users: UsersTuple) -> None:
        self.auth_client = auth_client
        self.users = users

    # ----- List View --------------------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", route_list_view_test_cases)
    def test_route_list_view(self, test_case: L_TestCase) -> None:
        client = self.get_testcase_client(test_case)

        cache.clear()
        response = client.get(reverse("route-list"))

        assert response.status_code == test_case.expected_status
        if response.status_code == status.HTTP_200_OK:
            assert isinstance(response.data, dict)
        else:
            for key in test_case.expected_data:
                assert key in response.data

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case: CaseType) -> APIClient:
        return self.auth_client(getattr(self.users, test_case.auth_user))
