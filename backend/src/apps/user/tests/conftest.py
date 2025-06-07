import pytest

from core.tests.fixtures import *  # noqa: F401, F403
from core.tests.typing import DataTypeTuple


@pytest.fixture(scope="session")
def testcase_data() -> DataTypeTuple:
    for_partial_update = {
        "username": "anthony_hopkins",
        "first_name": "Anthony",
        "last_name": "Hopkins",
        "language": "en",
    }
    return DataTypeTuple(for_partial_update)
