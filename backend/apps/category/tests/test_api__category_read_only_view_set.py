from collections import namedtuple as nt

import pytest
from django.conf import settings
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status

from apps.category.models import Category

from .conftest import UserSchema

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
L_TestCase = nt("List", ["auth_user", "get_popular", "expected_status"])
R_TestCase = nt("Retrieve", ["auth_user", "expected_status"])

# ----- Test Cases -----------------------------------------------------------------------------------------------------
list_category_test_cases = [
    # "auth_user", "get_popular", "expected_status"
    L_TestCase("not_auth", False, status.HTTP_200_OK),
    L_TestCase("admin", True, status.HTTP_200_OK),
    L_TestCase("admin", False, status.HTTP_200_OK),
    L_TestCase("user1", True, status.HTTP_200_OK),
]
retrieve_category_test_cases = [
    # "auth_user", "expected_status"
    R_TestCase("not_auth", status.HTTP_200_OK),
    R_TestCase("admin", status.HTTP_200_OK),
    R_TestCase("user1", status.HTTP_200_OK),
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
        query_params = {"popular": test_case.get_popular}
        response = client.get(url, data=query_params)

        assert response.status_code == test_case.expected_status
        assert isinstance(response.data, list)

    # ----- Retrieve Categories ----------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", retrieve_category_test_cases)
    def test_category_detail_view(self, test_case: R_TestCase):
        client = self.get_testcase_client(test_case)

        cache.clear()
        category = self.model.objects.first()
        url = reverse("category-detail", kwargs={"pk": category.pk})

        languages = [language[0] for language in settings.LANGUAGES]
        responses = {lang: client.get(url, HTTP_ACCEPT_LANGUAGE=lang) for lang in languages}

        for lang, response in responses.items():
            assert response.status_code == test_case.expected_status
            assert isinstance(response.data, dict)
            assert response.data.get("title") == category.safe_translation_getter("title", language_code=lang)

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case):
        return self.client(getattr(self.users, test_case.auth_user))
