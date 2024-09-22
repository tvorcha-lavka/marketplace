from collections import namedtuple

import pytest

from apps.user_auth.tests.conftest import code_factory  # noqa: F401
from core.conftest import UserSchema, api_client, auth_client, users  # noqa: F401

# ----- Data Fixtures --------------------------------------------------------------------------------------------------
DataType = namedtuple("DataType", ["valid_data", "invalid_data"])


@pytest.fixture
def user_data():
    password = "TestPassword123"

    return {
        "login": DataType(
            {"email": "user1@gmail.com", "password": password},
            {"email": "user1@gmailcom", "password": password},
        ),
        "signup": DataType(
            {"email": "user@gmail.com", "password": password},
            {"email": "user@gmail.com", "password": "password"},
        ),
    }
