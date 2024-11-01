import pytest
from django_filters import BooleanFilter, ChoiceFilter, NumberFilter

from apps.category.filters import CategoryFilter


@pytest.mark.django_db
class TestCategoryFilter:
    def test_fields(self):
        filter_instance = CategoryFilter(data={}, queryset=None)

        assert isinstance(filter_instance.filters["lang"], ChoiceFilter)
        assert isinstance(filter_instance.filters["popular"], BooleanFilter)
        assert isinstance(filter_instance.filters["level"], NumberFilter)

    @pytest.mark.parametrize("value", (True, False))
    def test_get_popular_categories(self, categories, category_queryset, value):
        expected_ids = [category.id for category in categories]

        # Create a filter with `popular` parameter
        filter_instance = CategoryFilter(data={"popular": value}, queryset=category_queryset)

        # Call the filter
        filtered_qs = filter_instance.qs

        # Check that the categories are filtered by card orientation
        assert filtered_qs.filter(id__in=expected_ids).exists()

        # Check that filtering is applied correctly by category id
        assert list(filtered_qs.only("pk").values_list("pk", flat=True)) == expected_ids
