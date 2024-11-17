from collections import namedtuple as nt

import pytest
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status

from apps.category.models import Category

from .conftest import UserSchema

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
CatalogListTestCase = nt("CatalogList", ["auth_user", "expected_status"])

# ----- Test Cases -----------------------------------------------------------------------------------------------------
catalog_list_test_cases = [
    # "auth_user", "expected_status"
    CatalogListTestCase("not_auth", status.HTTP_200_OK),
    CatalogListTestCase("admin", status.HTTP_200_OK),
    CatalogListTestCase("user1", status.HTTP_200_OK),
]


@pytest.mark.django_db
@pytest.mark.usefixtures("migrate_categories")
class TestCatalogList:

    model = Category

    @pytest.fixture(autouse=True)
    def setup_method(self, auth_client, users):
        self.client = auth_client
        self.users: UserSchema = users

    # ----- List Catalog Items -----------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", catalog_list_test_cases)
    def test_catalog_list_view(self, test_case: CatalogListTestCase):
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
    def get_testcase_client(self, test_case):
        return self.client(getattr(self.users, test_case.auth_user))
