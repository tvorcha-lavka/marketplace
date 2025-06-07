from typing import Any

import pytest
from django.db.models import QuerySet
from django.test import RequestFactory
from pytest_mock import MockerFixture

from apps.admin.sites import AdminSite
from apps.filter.admin import FilterTypeAdmin
from apps.filter.filters import FilterTypeFilterAdmin
from apps.filter.models import FilterType


class TestFilterTypeFilterAdmin:

    @pytest.fixture(autouse=True)
    def setup(self, mocker: MockerFixture, rf: RequestFactory) -> None:
        self.model = FilterType

        self.filter_admin = FilterTypeFilterAdmin
        self.model_admin = FilterTypeAdmin(self.model, AdminSite())

        self.request = rf.get("/admin/filtertype/filtertype/")
        self.mock_filter_type = mocker.MagicMock(spec=self.model)

        self.mock_qs = mocker.MagicMock(spec=QuerySet)

        mocker.patch.object(self.model, "objects", new=self.mock_qs)
        mocker.patch.object(self.mock_qs, "all", return_value=self.mock_qs)
        mocker.patch.object(self.mock_qs, "filter", return_value=self.mock_qs)
        mocker.patch.object(self.mock_qs, "prefetch_related", return_value=[self.mock_filter_type])

    @pytest.mark.parametrize("params, with_params", (({"filter_id": "1"}, True), ({}, False)))
    def test_lookups(self, mocker: MockerFixture, params: dict[str, Any], with_params: bool) -> None:
        # Initialize FilterTypeFilterAdmin
        _filter = self.filter_admin(self.request, params, self.mock_filter_type, self.model_admin)

        # Call lookups
        lookup_choices = _filter.lookups(self.request, self.model_admin)

        # Check that the filter method was called to get all objects
        # note: all method is called 2 times because init method calls lookups method
        assert self.mock_qs.all.call_args == mocker.call()
        assert self.mock_qs.all.call_count == 2

        # Check that the filter method was called to search by filter_id
        # note: filter method is called 2 times because init method calls lookups method
        if with_params:
            assert self.mock_qs.filter.call_args == mocker.call(id=1)
            assert self.mock_qs.filter.call_count == 2

        else:  # Check that the filter method was not called
            self.mock_qs.filter.assert_not_called()

        # Checking the result of lookups
        assert lookup_choices == [(str(self.mock_filter_type.pk), self.mock_filter_type.filter_name)]

    @pytest.mark.parametrize("params, with_params", (({"filter_id": "1"}, True), ({}, False)))
    def test_queryset(self, mocker: MockerFixture, params: dict[str, Any], with_params: bool) -> None:
        # Initialize FilterTypeFilterAdmin
        _filter = self.filter_admin(self.request, params, self.mock_filter_type, self.model_admin)

        # Call filter queryset
        qs = mocker.MagicMock(spec=QuerySet)
        filtered_queryset = _filter.queryset(self.request, qs)

        if with_params:  # Check that returns filtered queryset
            qs.filter.assert_called_once_with(filter_type_id=1)
            assert filtered_queryset == qs.filter.return_value

        else:  # Check that returns same queryset
            assert filtered_queryset == qs
