from collections import namedtuple

import pytest

from core.conftest import UserSchema, api_client, auth_client, django_db_setup, users  # noqa: F401

# ----- Data Fixtures --------------------------------------------------------------------------------------------------
DataType = namedtuple("DataType", ["valid_data", "invalid_data"])


@pytest.fixture
def user_data():
    password = "TestPassword123"

    return {
        "social_oauth2": DataType(
            {"state": "valid_state", "code": "valid_code"},
            {"state": "valid_state", "code": "invalid_code"},
        ),
        "password_reset": DataType(
            {"email": "user1@gmail.com"},
            {"email": "nonexistent@gmail.com"},
        ),
        "password_reset_confirm": DataType(
            {"token": "valid_token", "password": password, "password2": password},
            {"token": "invalid_token", "password": password, "password2": password},
        ),
    }
