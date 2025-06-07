import pytest

from core.tests.fixtures import *  # noqa: F401, F403
from core.tests.typing import ValidOrInvalidDataTuple

# ----- Data Fixtures --------------------------------------------------------------------------------------------------


@pytest.fixture
def data() -> ValidOrInvalidDataTuple:
    valid_data = {"state": "valid_state", "code": "valid_code"}
    invalid_data = {"state": "valid_state", "code": "invalid_code"}
    return ValidOrInvalidDataTuple(valid_data, invalid_data)
