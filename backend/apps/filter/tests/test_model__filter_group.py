import pytest

from apps.filter.models import FilterGroup


class TestFilterGroup:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.filter_group = FilterGroup(name="Test Filter Group")

    def test_str_method(self, mocker):
        # Mock `list_formatting` method
        values_list_str = "Value 1, Value 2"
        mocker.patch.object(self.filter_group, "list_formatting", return_value=values_list_str)

        # Check that the `__str__` method returns the expected value
        assert str(self.filter_group) == f"{self.filter_group.name} ({values_list_str})"  # type: ignore

    def test_field_for_slug(self):
        # Check that the `field_for_slug` method returns the expected value
        assert self.filter_group.field_for_slug() == "name"
