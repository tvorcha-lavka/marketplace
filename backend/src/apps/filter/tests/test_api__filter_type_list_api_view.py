from collections import namedtuple as nt
from typing import Any, TypeAlias, cast

import pytest
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status

from core.tests.typing import APIClient, AuthClientType, UsersTuple

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
L_TestCase = nt(
    "L_TestCase", ["auth_user", "category_id", "expected_status", "filter_types_count", "filter_values_count"]
)
CaseType: TypeAlias = L_TestCase

# ----- Test Cases -----------------------------------------------------------------------------------------------------
list_filter_test_cases = [
    # "auth_user", "category_id", "expected_status", "filter_types_count", "filter_values_count"
    L_TestCase("not_auth", 1, status.HTTP_200_OK, 2, [4, 4]),
    L_TestCase("not_auth", 2, status.HTTP_200_OK, 3, [4, 4, 4]),
    L_TestCase("not_auth", 0, status.HTTP_200_OK, 0, []),
]


@pytest.mark.django_db
@pytest.mark.usefixtures("filter_factory")
class TestFilterTypeListAPIView:
    @pytest.fixture(autouse=True)
    def setup(self, auth_client: AuthClientType, users: UsersTuple) -> None:
        self.client = auth_client
        self.users = users

    @pytest.mark.parametrize("test_case", list_filter_test_cases)
    def test_filter_list_view(self, test_case: L_TestCase) -> None:
        client = self.get_testcase_client(test_case)
        cache.clear()

        url = reverse("filter-list")
        query_params = {"category_id": test_case.category_id}

        response = client.get(url, data=query_params, HTTP_ACCEPT_LANGUAGE="uk")
        data = cast(list[dict[str, Any]], response.data)

        assert response.status_code == test_case.expected_status
        assert len(data) == test_case.filter_types_count

        for filter_type, count in zip(data, test_case.filter_values_count):
            assert len(filter_type["values"]) == count

        for filter_type_field in ("id", "required", "name", "values"):
            assert all(filter_type_field in item for item in data)

        filter_values_fields = ("id", "value", "description", "metadata", "product_count")
        for filter_type, filter_value_field in zip(data, filter_values_fields):
            assert all(filter_value_field in item for item in filter_type["values"])

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case: CaseType) -> APIClient:
        return self.client(getattr(self.users, test_case.auth_user))
