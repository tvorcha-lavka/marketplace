from collections import namedtuple

import pytest
from rest_framework.test import APIClient

from apps.user.models import User as UserModel

# ----- Schemas --------------------------------------------------------------------------------------------------------
UserSchema = namedtuple("Users", ["not_auth", "admin", "user1", "user2"])


# ----- General Fixtures -----------------------------------------------------------------------------------------------
@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(api_client):
    def _auth_client(user=None):
        api_client.force_authenticate(user=user)
        return api_client

    return _auth_client


@pytest.fixture(scope="session")
def django_db_setup(django_db_setup, django_db_blocker):  # noqa: django_db_setup
    with django_db_blocker.unblock():
        if not is_db_data():
            create_test_data()


# ----- User Fixtures --------------------------------------------------------------------------------------------------
@pytest.fixture
def users():
    usernames = ["admin", "user1", "user2"]
    users_list = list(UserModel.objects.filter(username__in=usernames))
    return UserSchema(None, *users_list)


# ----- Data -----------------------------------------------------------------------------------------------------------
def create_test_data():
    users = create_users()  # noqa: F841


def is_db_data():
    return bool(list(UserModel.objects.all()))


def create_users():
    admin = UserModel.objects.create_superuser("admin", "admin@gmail.com", "TestPassword123")
    user1 = UserModel.objects.create_user("user1", "user1@gmail.com", "TestPassword123")
    user2 = UserModel.objects.create_user("user2", "user2@gmail.com", "TestPassword123")
    return UserSchema(None, admin, user1, user2)
