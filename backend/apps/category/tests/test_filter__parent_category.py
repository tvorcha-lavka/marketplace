import pytest
from django.db.models import QuerySet

from apps.category.admin import CategoryAdmin
from apps.category.filters import ParentCategoryFilter
from apps.category.models import Category


class TestParentCategoryFilter:
    @pytest.fixture(autouse=True)
    def setup(self, mocker, rf):
        self.request = rf.get("/admin/category/category/")
        self.mock_category = mocker.MagicMock(spec=Category)

        self.mock_qs = mocker.MagicMock(spec=QuerySet)
        self.mock_qs.filter.return_value = [self.mock_category]
        self.mock_qs.prefetch_related.return_value = [self.mock_category]

        self.mock_get = mocker.patch.object(Category.objects, "get", return_value=self.mock_category)
        self.mock_filter = mocker.patch.object(Category.objects, "filter", return_value=self.mock_qs)

        self.mock_category.get_children.return_value.filter.return_value.distinct.return_value = [self.mock_category]

    @pytest.mark.parametrize("params, is_params", (({"parent_id": "1"}, True), ({}, False)))
    def test_lookups(self, params, is_params):
        # Initialize ParentCategoryFilter
        _filter = ParentCategoryFilter(self.request, params, self.mock_category, CategoryAdmin)

        if is_params:  # Check that the get method was called to get the category children
            self.mock_get.assert_called_once_with(id="1")

        else:  # Check that the filter method was called to get the categories with level 0
            self.mock_filter.assert_called_once_with(level=0)

        # Check the result of lookups
        assert _filter.lookup_choices == [(self.mock_category.id, self.mock_category.title)]

    @pytest.mark.parametrize("params, is_params", (({"parent_id": "1"}, True), ({}, False)))
    def test_queryset(self, params, is_params):
        # Initialize ParentCategoryFilter
        _filter = ParentCategoryFilter(self.request, params, self.mock_category, CategoryAdmin)

        # Call filter queryset
        filtered_queryset = _filter.queryset(self.request, self.mock_qs)

        if is_params:  # Check that returns filtered queryset
            self.mock_qs.filter.assert_called_once_with(parent_id="1")
            assert filtered_queryset == [self.mock_category]

        else:  # Check that returns same queryset
            assert filtered_queryset == self.mock_qs
