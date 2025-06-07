from collections import namedtuple as nt
from typing import TypeAlias

import pytest
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status

from apps.category.models import Category
from core.tests.typing import APIClient, AuthClientType, UsersTuple

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
C_TestCase = nt("C_TestCase", ["auth_user", "expected_status"])
CaseType: TypeAlias = C_TestCase

# ----- Test Cases -----------------------------------------------------------------------------------------------------
catalog_list_test_cases = [
    # "auth_user", "expected_status"
    C_TestCase("not_auth", status.HTTP_200_OK),
    C_TestCase("admin", status.HTTP_200_OK),
    C_TestCase("user1", status.HTTP_200_OK),
]


@pytest.mark.django_db
@pytest.mark.usefixtures("migrate_categories")
class TestCatalogList:

    model = Category

    @pytest.fixture(autouse=True)
    def setup(self, auth_client: AuthClientType, users: UsersTuple) -> None:
        self.client = auth_client
        self.users = users

    # ----- List Catalog Items -----------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", catalog_list_test_cases)
    def test_catalog_list_view(self, test_case: C_TestCase) -> None:
        client = self.get_testcase_client(test_case)

        cache.clear()
        url = reverse("catalog-list")
        response = client.get(url)

        assert response.status_code == test_case.expected_status
        assert isinstance(response.data, list)

        excepted_fields = ["id", "parent_id", "name", "title", "url", "image"]
        for field in excepted_fields:
            assert all(field in item for item in response.data)

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case: CaseType) -> APIClient:
        return self.client(getattr(self.users, test_case.auth_user))
