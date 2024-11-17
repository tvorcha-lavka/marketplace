from collections import namedtuple as nt

import pytest
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status

from .conftest import UserSchema

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
L_TestCase = nt("List", ["auth_user", "category_id", "expected_status", "filter_types_count", "filter_values_count"])

# ----- Test Cases -----------------------------------------------------------------------------------------------------
list_filter_test_cases = [
    # "auth_user", "category_id", "expected_status", "filter_types_count", "filter_values_count"
    L_TestCase("not_auth", 1, status.HTTP_200_OK, 2, [4, 4]),
    L_TestCase("not_auth", 2, status.HTTP_200_OK, 3, [4, 4, 4]),
]


@pytest.mark.django_db
@pytest.mark.usefixtures("filter_factory")
class TestFilterTypeListAPIView:
    @pytest.fixture(autouse=True)
    def setup_method(self, auth_client, users):
        self.client = auth_client
        self.users: UserSchema = users

    @pytest.mark.parametrize("test_case", list_filter_test_cases)
    def test_filter_list_view(self, test_case: L_TestCase):
        client = self.get_testcase_client(test_case)
        cache.clear()

        url = reverse("filter-list")
        headers = {"Accept-Language": "uk"}
        query_params = {"category_id": test_case.category_id}

        response = client.get(url, headers=headers, query_params=query_params)

        assert response.status_code == test_case.expected_status
        assert len(response.data) == test_case.filter_types_count

        for filter_type, count in zip(response.data, test_case.filter_values_count):
            assert len(filter_type["values"]) == count

        for filter_type_field in ("id", "required", "name", "values"):
            assert all(filter_type_field in item for item in response.data)

        filter_values_fields = ("id", "value", "description", "metadata", "product_count")
        for filter_type, filter_value_field in zip(response.data, filter_values_fields):
            assert all(filter_value_field in item for item in filter_type["values"])

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case):
        return self.client(getattr(self.users, test_case.auth_user))
