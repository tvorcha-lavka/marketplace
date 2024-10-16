import pytest

from apps.filter.models import FilterType, FilterValue


class TestFilterValue:

    @pytest.fixture(autouse=True)
    def setup(self):
        self.filter_type = FilterType(name="Test Filter Type")
        self.filter_value = FilterValue(filter_type=self.filter_type, value="Test Filter Value")

    def test_str_method(self):
        expected_value = f"{str(self.filter_type)} - {self.filter_value.value}"  # type: ignore
        # Check that the `__str__` method returns the expected value
        assert str(self.filter_value) == expected_value

    def test_field_for_slug(self):
        # Check that the `field_for_slug` method returns the expected value
        assert self.filter_value.field_for_slug() == "value"
