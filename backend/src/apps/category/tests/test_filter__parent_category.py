from typing import Any

import pytest
from django.db.models import QuerySet
from django.test import RequestFactory
from pytest_mock import MockerFixture

from apps.admin.sites import AdminSite
from apps.category.admin import CategoryAdmin
from apps.category.filters import ParentCategoryFilter
from apps.category.models import Category


class TestParentCategoryFilter:
    @pytest.fixture(autouse=True)
    def setup(self, mocker: MockerFixture, rf: RequestFactory) -> None:
        self.request = rf.get("/admin/category/category/")
        self.mock_category = mocker.MagicMock(spec=Category)
        self.category_admin = CategoryAdmin(Category, AdminSite())

        self.mock_qs = mocker.MagicMock(spec=QuerySet)
        self.mock_qs.filter.return_value = [self.mock_category]
        self.mock_qs.prefetch_related.return_value = [self.mock_category]

        self.mock_get = mocker.patch.object(Category.objects, "get", return_value=self.mock_category)
        self.mock_filter = mocker.patch.object(Category.objects, "filter", return_value=self.mock_qs)

        self.mock_category.get_children.return_value.filter.return_value.distinct.return_value = [self.mock_category]

    @pytest.mark.parametrize("params, is_params", (({"parent_id": "1"}, True), ({}, False)))
    def test_lookups(self, params: dict[str, Any], is_params: bool) -> None:
        # Initialize ParentCategoryFilter
        _filter = ParentCategoryFilter(self.request, params, self.mock_category, self.category_admin)

        if is_params:  # Check that the get method was called to get the category children
            self.mock_get.assert_called_once_with(id=1)

        else:  # Check that the filter method was called to get the categories with level 0
            self.mock_filter.assert_called_once_with(level=0)

        # Check the result of lookups
        assert _filter.lookup_choices == [(str(self.mock_category.pk), self.mock_category.category_title)]

    @pytest.mark.parametrize("params, is_params", (({"parent_id": "1"}, True), ({}, False)))
    def test_queryset(self, params: dict[str, Any], is_params: bool) -> None:
        # Initialize ParentCategoryFilter
        _filter = ParentCategoryFilter(self.request, params, self.mock_category, self.category_admin)

        # Call filter queryset
        filtered_queryset = _filter.queryset(self.request, self.mock_qs)
        assert filtered_queryset is not None

        if is_params:  # Check that returns filtered queryset
            self.mock_qs.filter.assert_called_once_with(parent_id=1)
            assert filtered_queryset == self.mock_qs.filter.return_value

        else:  # Check that returns same queryset
            assert filtered_queryset == self.mock_qs
