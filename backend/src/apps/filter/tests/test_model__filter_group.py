import pytest

from apps.filter.models import FilterGroup, FilterType


class TestFilterGroup:
    @pytest.fixture(autouse=True)
    def setup(self) -> None:
        self.filter_type = FilterType(name="Test Filter Type")  # type: ignore[misc]
        self.filter_group = FilterGroup(filter_type=self.filter_type)

    def test_str_method(self) -> None:
        # Check that the `__str__` method returns the expected value
        assert str(self.filter_group) == self.filter_group.filter_type.filter_name
