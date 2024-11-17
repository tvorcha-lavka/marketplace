import pytest

from apps.filter.models import FilterType


class TestFilterType:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.name = "Test Filter Type"
        self.filter_type = FilterType(name=self.name)

    def test_str_method(self):
        # Check that the `__str__` method returns the expected value
        assert str(self.filter_type) == self.name
