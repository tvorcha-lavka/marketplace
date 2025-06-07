import pytest
from django_filters import BooleanFilter, NumberFilter

from apps.category.filters import CategoryFilter
from apps.category.managers import CategoryQuerySet
from apps.category.models import Category


@pytest.mark.django_db
class TestCategoryFilter:
    def test_fields(self) -> None:
        filter_instance = CategoryFilter(data={}, queryset=None)

        assert isinstance(filter_instance.filters["popular"], BooleanFilter)
        assert isinstance(filter_instance.filters["level"], NumberFilter)

    @pytest.mark.parametrize("value", (True, False))
    def test_get_popular_categories(
        self,
        categories: tuple[Category, Category],
        category_queryset: CategoryQuerySet,
        value: bool,
    ) -> None:
        expected_ids = [category.id for category in categories]

        # Create a filter with `popular` parameter
        filter_instance = CategoryFilter(data={"popular": value}, queryset=category_queryset)

        # Call the filter
        filtered_qs = filter_instance.qs

        # Check that the categories are filtered by card orientation
        assert filtered_qs.filter(id__in=expected_ids).exists()

        # Check that filtering is applied correctly by category id
        assert list(filtered_qs.only("pk").values_list("pk", flat=True)) == expected_ids
