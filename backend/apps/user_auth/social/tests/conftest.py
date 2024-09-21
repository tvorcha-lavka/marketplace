from collections import namedtuple

import pytest

from core.conftest import UserSchema, api_client, auth_client, users  # noqa: F401

# ----- Data Fixtures --------------------------------------------------------------------------------------------------
DataType = namedtuple("DataType", ["valid_data", "invalid_data"])


@pytest.fixture
def data():
    valid_data = {"state": "valid_state", "code": "valid_code"}
    invalid_data = {"state": "valid_state", "code": "invalid_code"}
    return DataType(valid_data, invalid_data)
