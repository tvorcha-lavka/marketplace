from collections import namedtuple

import pytest
from pytest_mock import MockerFixture

from apps.category.models import Category, Statistics


class TestModelStatistics:

    Schema = namedtuple(
        "Schema",
        [
            "method",
            "expected_views_count",
            "expected_purchases_count",
            "expected_popularity_score",
        ],
    )

    test_cases = [
        Schema("increment_views", 10.002, 5.0, 12.501),
        Schema("increment_purchases", 10.0, 5.002, 12.503),
        Schema("update_popularity", 10.0, 5.0, 12.5),
    ]

    def test_str_method_with_category(self) -> None:
        category = Category(title="Test Category")  # type: ignore[misc]
        statistics = Statistics(category=category)

        assert str(statistics) == category.category_title

    def test_str_method_without_category(self) -> None:
        statistics = Statistics()
        assert str(statistics) == statistics.__class__.__name__

    @pytest.mark.parametrize("test_case", test_cases)
    def test_methods(self, mocker: MockerFixture, test_case: Schema) -> None:
        # Create an instance of the Statistics model with initial values
        statistics = Statistics(views_count=10.0, purchases_count=5.0, popularity_score=0.0)
        statistics._step = 0.002

        # Mock `save` method
        mock_save = mocker.patch.object(statistics, "save")

        # Call method
        getattr(statistics, test_case.method)()

        # Check that `views_count` has been increased
        assert statistics.views_count == test_case.expected_views_count

        # Check that `purchases_count` not increased
        assert statistics.purchases_count == test_case.expected_purchases_count

        # Check that the `update_popularity` method was called and recalculated the popularity
        assert statistics.popularity_score == test_case.expected_popularity_score

        # Check that the save method was called
        mock_save.assert_called_once()
