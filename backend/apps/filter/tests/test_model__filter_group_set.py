import pytest

from apps.filter.models import FilterGroupSet


class TestFilterGroupSet:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.filter_group_set = FilterGroupSet(name="Test Filter Group Set")

    def test_str_method(self, mocker):
        # Mock `list_formatting` method
        group_list_str = "Group 1, Group 2"
        mocker.patch.object(self.filter_group_set, "list_formatting", return_value=group_list_str)

        # Check that the `__str__` method returns the expected value
        assert str(self.filter_group_set) == f"{self.filter_group_set.name} ({group_list_str})"  # type: ignore

    def test_field_for_slug(self):
        # Check that the `field_for_slug` method returns the expected value
        assert self.filter_group_set.field_for_slug() == "name"
