import pytest

from apps.filter.models import FilterGroup, FilterValue


class TestFilterGroup:

    @pytest.fixture(autouse=True)
    def setup(self):
        self.filter_type = FilterGroup(name="Test Filter Group")

    def test_str_method(self, mocker):
        # Create mocked FilterGroup
        mock_filter_group = mocker.MagicMock(spec=FilterGroup)
        mock_filter_group.name = "Test Group"

        # Mock related values into `filter_values`
        mock_filter_value1 = mocker.MagicMock(spec=FilterValue)
        mock_filter_value1.value = "Value 1"
        mock_filter_value2 = mocker.MagicMock(spec=FilterValue)
        mock_filter_value2.value = "Value 2"

        # Mock queryset methods for `filter_values`
        mock_filter_group.filter_values.all.return_value = [mock_filter_value1, mock_filter_value2]

        # Check that the `__str__` method returns the expected value
        expected_str = "Test Group (Value 1, Value 2)"
        assert FilterGroup.__str__(mock_filter_group) == expected_str

    def test_field_for_slug(self):
        # Check that the `field_for_slug` method returns the expected value
        assert self.filter_type.field_for_slug() == "name"
