from collections import namedtuple as nt
from typing import TypeAlias

import pytest
from django.conf import settings
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status

from apps.category.models import Category
from core.tests.typing import APIClient, AuthClientType, UsersTuple

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
L_TestCase = nt("L_TestCase", ["auth_user", "get_popular", "expected_status"])
R_TestCase = nt("R_TestCase", ["auth_user", "expected_status"])
CaseType: TypeAlias = L_TestCase | R_TestCase

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
    def setup(self, auth_client: AuthClientType, users: UsersTuple) -> None:
        self.client = auth_client
        self.users = users

    # ----- List Categories --------------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", list_category_test_cases)
    def test_category_list_view(self, test_case: L_TestCase) -> None:
        client = self.get_testcase_client(test_case)

        cache.clear()
        url = reverse("category-list")
        query_params = {"popular": test_case.get_popular}
        response = client.get(url, data=query_params)

        assert response.status_code == test_case.expected_status
        assert isinstance(response.data, list)

    # ----- Retrieve Categories ----------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", retrieve_category_test_cases)
    def test_category_detail_view(self, test_case: R_TestCase) -> None:
        client = self.get_testcase_client(test_case)

        cache.clear()
        category = self.model.objects.get(pk=1)
        url = reverse("category-detail", kwargs={"pk": category.pk})

        languages = [language[0] for language in settings.LANGUAGES]
        responses = {lang: client.get(url, HTTP_ACCEPT_LANGUAGE=lang) for lang in languages}

        for lang, response in responses.items():
            assert response.status_code == test_case.expected_status
            assert isinstance(response.data, dict)
            assert response.data.get("title") == category.safe_translation_getter("title", language_code=lang)

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case: CaseType) -> APIClient:
        return self.client(getattr(self.users, test_case.auth_user))
