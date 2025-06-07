import pytest
from pytest_django import DjangoDbBlocker
from rest_framework.test import APIClient

from apps.user.models import User as UserModel
from core.celery.client import app

from .typing import AuthClientType, UsersTuple
from .utils import create_users, get_users

__all__ = [
    "api_client",
    "auth_client",
    "users",
]


# ----- General Fixtures -----------------------------------------------------------------------------------------------
@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture
def auth_client(api_client: APIClient) -> AuthClientType:
    def _auth_client(user: UserModel | None = None) -> APIClient:
        api_client.force_authenticate(user=user)
        return api_client

    return _auth_client


# ----- User Fixtures --------------------------------------------------------------------------------------------------
@pytest.fixture(scope="session")
def users(django_db_setup: object, django_db_blocker: DjangoDbBlocker) -> UsersTuple:  # noqa: F841
    with django_db_blocker.unblock():
        return get_users() if UserModel.objects.exists() else create_users()


# ----- Celery ---------------------------------------------------------------------------------------------------------
# Configure to use async celery tasks in tests
app.conf.update(task_always_eager=True, task_eager_propagates=True)
