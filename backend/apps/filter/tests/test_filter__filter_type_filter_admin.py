import pytest
from django.db.models import QuerySet

from apps.filter.admin import FilterTypeFilterAdmin
from apps.filter.models import FilterType


class TestFilterTypeFilterAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker, rf):
        self.request = rf.get("/admin/filtertype/filtertype/")
        self.mock_filter_type = mocker.MagicMock(spec=FilterType)

        self.mock_qs = mocker.MagicMock(spec=QuerySet)
        self.mock_qs.filter.return_value = [self.mock_filter_type]
        self.mock_qs.prefetch_related.return_value = [self.mock_filter_type]

        self.mock_filter_type_filter = mocker.patch.object(FilterType.objects, "filter", return_value=self.mock_qs)
        self.mock_filter_type_all = mocker.patch.object(FilterType.objects, "all", return_value=self.mock_qs)

    @pytest.mark.parametrize("params, is_params", (({"filter_id": "1"}, True), ({}, False)))
    def test_lookups(self, params, is_params):
        # Initialize FilterTypeFilterAdmin
        _filter = FilterTypeFilterAdmin(self.request, params, self.mock_filter_type, None)

        if is_params:  # Check that the filter method was called to search by filter_id
            self.mock_filter_type_filter.assert_called_once_with(id="1")

        else:  # Check that the filter method was called to get all objects
            self.mock_filter_type_all.assert_called_once_with()

        # Проверяем результат lookups
        assert _filter.lookup_choices == [(self.mock_filter_type.id, self.mock_filter_type.name)]

    @pytest.mark.parametrize("params, is_params", (({"filter_id": "1"}, True), ({}, False)))
    def test_queryset(self, params, is_params):
        # Initialize FilterTypeFilterAdmin
        _filter = FilterTypeFilterAdmin(self.request, params, self.mock_filter_type, None)

        # Call filter queryset
        filtered_queryset = _filter.queryset(self.request, self.mock_qs)

        if is_params:  # Check that returns filtered queryset
            self.mock_qs.filter.assert_called_once_with(id="1")
            assert filtered_queryset == [self.mock_filter_type]

        else:  # Check that returns same queryset
            assert filtered_queryset == self.mock_qs
