import pytest

from apps.filter.models import FilterType


class TestFilterType:
    @pytest.fixture(autouse=True)
    def setup(self) -> None:
        self.name = "Test Filter Type"
        self.filter_type = FilterType(name=self.name)  # type: ignore[misc]

    def test_str_method(self) -> None:
        # Check that the `__str__` method returns the expected value
        assert str(self.filter_type) == self.name
