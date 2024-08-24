from collections import namedtuple

import pytest

from core.conftest import UserSchema, api_client, auth_client, users  # noqa: F401

# ----- Data Fixtures --------------------------------------------------------------------------------------------------
Data = namedtuple("Data", ["for_partial_update"])


@pytest.fixture
def testcase_data():
    for_partial_update = {
        "username": "anthony_hopkins",
        "first_name": "Anthony",
        "last_name": "Hopkins",
    }
    return Data(for_partial_update)
