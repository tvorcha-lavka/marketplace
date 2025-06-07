import pytest

from apps.user_auth.tests.conftest import code_factory  # noqa: F401
from core.tests.fixtures import *  # noqa: F401, F403
from core.tests.typing import ValidOrInvalidDataTuple, ValidOrInvalidUserDataType

# ----- Data Fixtures --------------------------------------------------------------------------------------------------


@pytest.fixture
def user_data() -> ValidOrInvalidUserDataType:
    password = "TestPassword123"

    return {
        "login": ValidOrInvalidDataTuple(
            {"email": "user1@gmail.com", "password": password},
            {"email": "user1@gmailcom", "password": password},
        ),
        "signup": ValidOrInvalidDataTuple(
            {"email": "user@gmail.com", "password": password},
            {"email": "user@gmail.com", "password": "password"},
        ),
    }
