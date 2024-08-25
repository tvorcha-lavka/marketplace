from collections import namedtuple

import pytest
from rest_framework.test import APIClient

from apps.user.models import User as UserModel

from .celery import app

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


# ----- User Fixtures --------------------------------------------------------------------------------------------------
@pytest.fixture(scope="session")
def users(django_db_setup, django_db_blocker):  # noqa: django_db_setup
    with django_db_blocker.unblock():
        return get_users() if UserModel.objects.exists() else create_users()


# ----- Data -----------------------------------------------------------------------------------------------------------


def create_users():
    extra_fields = {"first_name": "John", "last_name": "Doe"}
    admin = UserModel.objects.create_superuser("admin", "admin@gmail.com", "TestPassword123", **extra_fields)
    user1 = UserModel.objects.create_user("user1", "user1@gmail.com", "TestPassword123", **extra_fields)
    user2 = UserModel.objects.create_user("user2", "user2@gmail.com", "TestPassword123", **extra_fields)
    return UserSchema(None, admin, user1, user2)


def get_users():
    usernames = ["admin", "user1", "user2"]
    users_list = list(UserModel.objects.filter(username__in=usernames))
    return UserSchema(None, *users_list)


# ----- Celery ---------------------------------------------------------------------------------------------------------
# Configure to use async celery tasks in tests
app.conf.update(task_always_eager=True, task_eager_propagates=True)
