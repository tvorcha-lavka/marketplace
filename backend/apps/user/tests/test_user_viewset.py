from collections import namedtuple as nt

import pytest
from django.urls import reverse
from rest_framework import status

from apps.user.models import User

from .conftest import UserSchema

# ----- UserViewSet Test Case Schemas ----------------------------------------------------------------------------------
L_TestCase = nt("List", ["auth_user", "expected_status"])
R_TestCase = nt("Retrieve", ["auth_user", "user", "expected_status"])
P_TestCase = nt("PartialUpdate", ["auth_user", "user", "expected_status"])
D_TestCase = nt("Destroy", ["auth_user", "user", "expected_status"])

# ----- UserViewSet Test Cases -----------------------------------------------------------------------------------------
list_user_test_cases = [
    # "auth_user", "expected_status"
    L_TestCase("not_auth", status.HTTP_401_UNAUTHORIZED),
    L_TestCase("admin", status.HTTP_200_OK),
    L_TestCase("user1", status.HTTP_403_FORBIDDEN),
]
retrieve_user_test_cases = [
    # "auth_user", "retrieve_user", "expected_status"
    R_TestCase("not_auth", "user1", status.HTTP_401_UNAUTHORIZED),
    R_TestCase("admin", "user1", status.HTTP_200_OK),
    R_TestCase("user1", "user1", status.HTTP_200_OK),
    R_TestCase("user1", "user2", status.HTTP_403_FORBIDDEN),
]
partial_update_user_test_cases = [
    # "auth_user", "update_user", "expected_status"
    P_TestCase("not_auth", "user1", status.HTTP_401_UNAUTHORIZED),
    P_TestCase("admin", "user1", status.HTTP_200_OK),
    P_TestCase("user1", "user1", status.HTTP_200_OK),
    P_TestCase("user1", "user2", status.HTTP_403_FORBIDDEN),
]
destroy_user_test_cases = [
    # "auth_user", "destroy_user", "expected_status"
    D_TestCase("not_auth", "user1", status.HTTP_401_UNAUTHORIZED),
    D_TestCase("admin", "user1", status.HTTP_204_NO_CONTENT),
    D_TestCase("user1", "user1", status.HTTP_204_NO_CONTENT),
    D_TestCase("user1", "user2", status.HTTP_403_FORBIDDEN),
]


# ----- UserViewSet Tests ----------------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestUserViewSet:

    model = User

    @pytest.fixture(autouse=True)
    def setup_method(self, auth_client, users, testcase_data):
        self.client = auth_client
        self.users: UserSchema = users
        self.partial_update_data = testcase_data.for_partial_update

    # ----- List User --------------------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", list_user_test_cases)
    def test_list_user(self, test_case: L_TestCase):
        client = self.get_testcase_client(test_case)

        url = reverse("user-list")
        response = client.get(url)

        assert response.status_code == test_case.expected_status
        if test_case.expected_status == status.HTTP_200_OK:
            assert isinstance(response.data.get("results"), list)
            assert response.data.get("count") == self.initial_users_count()

    # ----- Retrieve User ----------------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", retrieve_user_test_cases)
    def test_retrieve_user(self, test_case: R_TestCase):
        client, user = self.get_testcase_client_and_user(test_case)

        url = reverse("user-detail", kwargs={"user_id": user.id})
        response = client.get(url)

        assert response.status_code == test_case.expected_status
        if test_case.expected_status == status.HTTP_200_OK:
            assert response.data.get("email") == user.email

    # ----- Partial Update User ----------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", partial_update_user_test_cases)
    def test_partial_update_user(self, test_case: P_TestCase):
        client, user = self.get_testcase_client_and_user(test_case)

        url = reverse("user-detail", kwargs={"user_id": user.id})
        data = self.partial_update_data
        response = client.patch(url, data=data)

        assert response.status_code == test_case.expected_status
        if test_case.expected_status == status.HTTP_200_OK:
            self.verify_user_fields(user.id, data)

    # ----- Destroy User -----------------------------------------------------------------------------------------------
    @pytest.mark.parametrize("test_case", destroy_user_test_cases)
    def test_destroy_user(self, test_case: D_TestCase):
        client, user = self.get_testcase_client_and_user(test_case)
        users_count = self.initial_users_count()

        url = reverse("user-detail", kwargs={"user_id": user.id})
        response = client.delete(url)

        assert response.status_code == test_case.expected_status
        if test_case.expected_status == status.HTTP_204_NO_CONTENT:
            assert self.model.objects.filter(id=user.id).first() is None
            assert self.model.objects.count() == users_count - 1

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def initial_users_count(self):
        return self.model.objects.count()

    def get_testcase_client(self, test_case):
        return self.client(getattr(self.users, test_case.auth_user))

    def get_testcase_user(self, test_case):
        return getattr(self.users, test_case.user)

    def get_testcase_client_and_user(self, test_case):
        client = self.get_testcase_client(test_case)
        user = self.get_testcase_user(test_case)
        return client, user

    def verify_user_fields(self, user_id: int, data: dict):
        user = self.model.objects.get(id=user_id)

        for field, value in data.items():
            assert getattr(user, field) == value
