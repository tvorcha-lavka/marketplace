import pytest
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.db import connection, transaction
from pytest_mock import MockerFixture

from apps.filter.models import FilterType, FilterValue


class TestFilterValue:
    @pytest.fixture(autouse=True)
    def setup(self) -> None:
        self.filter_type_obj = FilterType(name="Test Filter Type")  # type: ignore[misc]
        self.filter_value_obj = FilterValue(
            filter_type=self.filter_type_obj,
            value="Test Filter Value",  # type: ignore[misc]
        )

    def test_str_method(self) -> None:
        expected_value = f"{self.filter_type_obj} - {self.filter_value_obj.filter_value}"
        # Check that the `__str__` method returns the expected value
        assert str(self.filter_value_obj) == expected_value

    def test_clean_method(self, mocker: MockerFixture) -> None:
        # Mock the transaction ID returned by the database
        mock_cursor = mocker.patch.object(connection, "cursor")
        mock_cursor.return_value.__enter__.return_value.fetchone.return_value = [12345]

        # Mock the `on_commit` method, to avoid calling the database
        mock_on_commit = mocker.patch.object(transaction, "on_commit")

        # Ensure the cache is clear before starting
        cache_key = "filter_value.tnx:12345"
        cache.delete(cache_key)

        # Test clean method for a valid value
        self.filter_value_obj.clean()  # Should not raise an error
        cached_values = cache.get(cache_key, set())
        assert self.filter_value_obj.filter_value in cached_values
        mock_on_commit.assert_called_once()

        # Add the value to the cache manually to simulate a duplicate scenario
        cache.set(cache_key, {self.filter_value_obj.filter_value})

        # Test clean method for a duplicate value
        with pytest.raises(ValidationError):
            self.filter_value_obj.clean()

        # Clean up the cache after the test
        cache.delete(cache_key)
