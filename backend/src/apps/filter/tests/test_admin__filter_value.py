import pytest
from django.test import RequestFactory
from parler.admin import TranslatableAdmin
from parler.managers import TranslatableQuerySet
from pytest_mock import MockerFixture

from apps.admin.sites import AdminSite
from apps.filter.admin import FilterValueAdmin
from apps.filter.filters import FilterTypeFilterAdmin
from apps.filter.forms import FilterValueForm
from apps.filter.models import FilterValue


class TestFilterValueAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker: MockerFixture) -> None:
        self.site = AdminSite()
        self.model = FilterValue
        self.admin = FilterValueAdmin(self.model, self.site)
        self.app_url = "/admin/filter/filtervalue/"

        # Mock the `_display_field` method
        mocker.patch.object(self.admin, "_display_field", return_value="mocked_display_value")

        # Mock queryset for TranslatableAdmin
        mocker.patch.object(TranslatableAdmin, "get_queryset", return_value=TranslatableQuerySet(self.model))

    def test_list_display(self) -> None:
        list_display = ("display_filter_type", "value", "description", "all_languages_column")
        assert self.admin.list_display == list_display

    def test_list_display_links(self) -> None:
        list_display_links = ("value",)
        assert self.admin.list_display_links == list_display_links

    def test_list_filter(self) -> None:
        list_filter = (FilterTypeFilterAdmin,)
        assert self.admin.list_filter == list_filter

    def test_search_fields(self) -> None:
        search_fields = ("filter_type__translations__name", "translations__value")
        assert self.admin.search_fields == search_fields

    def test_form(self) -> None:
        assert self.admin.form == FilterValueForm

    def test_get_queryset(self, rf: RequestFactory) -> None:
        request = rf.get(self.app_url)
        qs = self.admin.get_queryset(request)

        select_related = qs.query.select_related
        pref_lookups = qs._prefetch_related_lookups  # type: ignore[attr-defined]
        assert isinstance(select_related, dict) and isinstance(pref_lookups, tuple)

        # Check that filtering and sorting are set correctly
        assert qs.query.distinct
        assert "filter_type" in select_related
        assert "translations" and "filter_type__translations" in pref_lookups

    def test_display_filter_type(self, mocker: MockerFixture) -> None:
        # Mock object
        obj = mocker.Mock()

        # Call `display_filter_type` method
        display_value = self.admin.display_filter_type(obj)

        # Check that `display_filter_type` calls and returns the mocked value
        assert display_value == "mocked_display_value"
