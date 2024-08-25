from collections import namedtuple

import pytest

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
            {"email": "user@gmail.com", "password": password, "password2": password},
            {"email": "user@gmailcom", "password": "password", "password2": "password"},
        ),
        "social_oauth2": DataType(
            {"state": "valid_state", "code": "valid_code"},
            {"state": "valid_state", "code": "invalid_code"},
        ),
        "password_reset": DataType(
            {"email": "user1@gmail.com"},
            {"email": "nonexistent@gmail.com"},
        ),
        "password_reset_confirm": DataType(
            {"token": "valid_token", "password": password},
            {"token": "invalid_token", "password": password},
        ),
    }
