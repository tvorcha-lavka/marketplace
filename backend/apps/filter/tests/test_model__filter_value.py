import pytest
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.db import connection, transaction

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

    def test_clean_method(self, mocker):
        # Mock the transaction ID returned by the database
        mock_cursor = mocker.patch.object(connection, "cursor")
        mock_cursor.return_value.__enter__.return_value.fetchone.return_value = [12345]

        # Mock the `on_commit` method, to avoid calling the database
        mock_on_commit = mocker.patch.object(transaction, "on_commit")

        # Ensure the cache is clear before starting
        cache_key = "filter_value.tnx:12345"
        cache.delete(cache_key)

        # Test clean method for a valid value
        self.filter_value.clean()  # Should not raise an error
        cached_values = cache.get(cache_key, set())
        assert self.filter_value.value in cached_values  # type: ignore
        mock_on_commit.assert_called_once()

        # Add the value to the cache manually to simulate a duplicate scenario
        cache.set(cache_key, {self.filter_value.value})  # type: ignore

        # Test clean method for a duplicate value
        with pytest.raises(ValidationError):
            self.filter_value.clean()

        # Clean up the cache after the test
        cache.delete(cache_key)
