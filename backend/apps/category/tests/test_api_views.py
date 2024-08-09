from collections import namedtuple as nt

import pytest
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status

from apps.category.models import Category

from .conftest import UserSchema

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
L_TestCase = nt("List", ["auth_user", "expected_status"])
R_TestCase = nt("Retrieve", ["auth_user", "expected_status"])

# ----- Test Cases -----------------------------------------------------------------------------------------------------
list_category_test_cases = [
    # "auth_user", "expected_status"
    L_TestCase("not_auth", status.HTTP_401_UNAUTHORIZED),
    L_TestCase("admin", status.HTTP_200_OK),
    L_TestCase("user1", status.HTTP_403_FORBIDDEN),
]
retrieve_category_test_cases = [
    # "auth_user", "expected_status"
    R_TestCase("not_auth", status.HTTP_401_UNAUTHORIZED),
    R_TestCase("admin", status.HTTP_200_OK),
    R_TestCase("user1", status.HTTP_403_FORBIDDEN),
]


@pytest.mark.django_db
@pytest.mark.usefixtures("migrate_categories")
class TestCategory:

    model = Category

    @pytest.fixture(autouse=True)
    def setup_method(self, auth_client, users):
        self.client = auth_client
        self.users: UserSchema = users

    # ----- List Categories --------------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", list_category_test_cases)
    def test_category_list_view(self, test_case: L_TestCase):
        client = self.get_testcase_client(test_case)

        cache.clear()
        url = reverse("category-list")
        response = client.get(url)

        assert response.status_code == test_case.expected_status
        if response.status_code == status.HTTP_200_OK:
            assert isinstance(response.data, list)
            assert len(response.data) == self.initial_category_parents_count()

    # ----- Retrieve Categories ----------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", retrieve_category_test_cases)
    def test_category_detail_view(self, test_case: R_TestCase):
        client = self.get_testcase_client(test_case)

        cache.clear()

        category = self.model.objects.first()
        url = reverse("category-detail", kwargs={"pk": category.pk})
        response = client.get(url)

        assert response.status_code == test_case.expected_status
        if response.status_code == status.HTTP_200_OK:
            assert isinstance(response.data, dict)

            for key, value in response.data.items():
                if key not in ["parents", "subcategories"]:
                    assert getattr(category, key) == value

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case):
        return self.client(getattr(self.users, test_case.auth_user))

    def initial_category_parents_count(self):
        return self.model.objects.filter(parents=None).count()
