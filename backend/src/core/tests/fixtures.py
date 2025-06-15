from typing import Any

import pytest
from pytest_django import DjangoDbBlocker
from pytest_mock import MockerFixture
from rest_framework.test import APIClient

from apps.user.models import User as UserModel
from core.celery.client import app

from .typing import AuthClientType, UsersTuple
from .utils import create_users, get_users

__all__ = [
    "api_client",
    "auth_client",
    "celery_send_task_mocker",
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


@pytest.fixture(scope="function")
def celery_send_task_mocker(mocker: MockerFixture) -> None:

    def apply_async(*args: Any, **kwargs: Any) -> None:
        """Patches `send_task` method as `apply_async`."""
        if task := app.tasks.get(kwargs.pop("name", None)):
            task.apply_async(*args, **kwargs)

    mocker.patch.object(app, "send_task", side_effect=apply_async)
