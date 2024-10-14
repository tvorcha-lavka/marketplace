import pytest

from apps.filter.models import FilterType


class TestFilterType:

    @pytest.fixture(autouse=True)
    def setup(self):
        self.filter_type = FilterType(name="Test Filter Type")

    def test_field_for_slug(self):
        # Check that the `field_for_slug` method returns the expected value
        assert self.filter_type.field_for_slug() == "name"
