import pytest
from django.test import RequestFactory
from parler.admin import TranslatableAdmin
from parler.managers import TranslatableQuerySet
from pytest_mock import MockerFixture

from apps.admin.sites import AdminSite
from apps.filter.admin import FilterGroupAdmin
from apps.filter.filters import FilterTypeFilterAdmin
from apps.filter.forms import FilterGroupForm
from apps.filter.models import FilterGroup


class TestFilterGroupAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker: MockerFixture) -> None:
        self.site = AdminSite()
        self.model = FilterGroup
        self.admin = FilterGroupAdmin(self.model, self.site)
        self.app_url = "/admin/filter/filtergroup/"

        # Mock the `_display_field` and `_display_related_fields` methods
        mocker.patch.object(self.admin, "_display_field", return_value="mocked_display_value")
        mocker.patch.object(self.admin, "_display_related_fields", return_value="mocked_display_value")

        # Mock queryset for TranslatableAdmin
        mocker.patch.object(TranslatableAdmin, "get_queryset", return_value=TranslatableQuerySet(self.model))

    def test_list_display(self) -> None:
        list_display = ("category", "display_filter_type", "display_filter_values")
        assert self.admin.list_display == list_display

    def test_list_filter(self) -> None:
        list_filter = (FilterTypeFilterAdmin,)
        assert self.admin.list_filter == list_filter

    def test_search_fields(self) -> None:
        search_fields = ("category__translations__name", "filter_type__translations__name")
        assert self.admin.search_fields == search_fields

    def test_form(self) -> None:
        assert self.admin.form == FilterGroupForm

    def test_filter_horizontal(self) -> None:
        filter_horizontal = ("filter_values",)
        assert self.admin.filter_horizontal == filter_horizontal

    def test_get_queryset(self, rf: RequestFactory) -> None:
        select_related_values = ["category", "filter_type"]
        prefetch_related_values = [
            "category__translations",
            "filter_type__translations",
            "filter_values__translations",
        ]

        request_1 = rf.get(self.app_url)
        request_2 = rf.get(self.app_url + "1/change/")

        # Get model queryset
        qs_1 = self.admin.get_queryset(request_1)
        qs_2 = self.admin.get_queryset(request_2)

        select_related_1 = qs_1.query.select_related
        select_related_2 = qs_2.query.select_related

        pref_lookups_1 = qs_1._prefetch_related_lookups  # type: ignore[attr-defined]
        pref_lookups_2 = qs_2._prefetch_related_lookups  # type: ignore[attr-defined]

        assert isinstance(select_related_1, bool) and not select_related_1
        assert isinstance(select_related_2, dict)
        assert isinstance(pref_lookups_1 and pref_lookups_2, tuple)

        # Check that filtering and sorting are set correctly
        assert all(lookup in pref_lookups_1 for lookup in prefetch_related_values)
        assert all(lookup in select_related_2 for lookup in select_related_values)
        assert all(lookup not in pref_lookups_2 for lookup in prefetch_related_values)

    def test_display_filter_type(self, mocker: MockerFixture) -> None:
        # Mock object
        obj = mocker.Mock()

        # Call `display_filter_type` method
        display_value = self.admin.display_filter_type(obj)

        # Check that `display_filter_type` calls and returns the mocked value
        assert display_value == "mocked_display_value"

    def test_display_filter_values(self, mocker: MockerFixture) -> None:
        # Mock object
        obj = mocker.Mock()

        # Call `display_filter_values` method
        display_value = self.admin.display_filter_values(obj)

        # Check that `display_filter_type` calls and returns the mocked value
        assert display_value == "mocked_display_value"
