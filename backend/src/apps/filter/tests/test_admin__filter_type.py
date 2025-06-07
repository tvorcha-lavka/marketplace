import pytest
from django.test import RequestFactory
from parler.admin import TranslatableAdmin
from parler.managers import TranslatableQuerySet
from pytest_mock import MockerFixture

from apps.admin.sites import AdminSite
from apps.filter.admin import FilterTypeAdmin
from apps.filter.forms import FilterTypeForm, FilterValueInline
from apps.filter.models import FilterType


class TestFilterTypeAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker: MockerFixture) -> None:
        self.site = AdminSite()
        self.model = FilterType
        self.admin = FilterTypeAdmin(self.model, self.site)
        self.app_url = "/admin/filter/filtertype/"

        # Mock the `_display_related_fields` method
        mocker.patch.object(self.admin, "_display_related_fields", return_value="mocked_display_value")

        # Mock queryset for TranslatableAdmin
        mocker.patch.object(TranslatableAdmin, "get_queryset", return_value=TranslatableQuerySet(self.model))

    def test_list_display(self) -> None:
        list_display = ("display_name", "display_filter_values", "list_position", "all_languages_column")
        assert self.admin.list_display == list_display

    def test_search_fields(self) -> None:
        search_fields = ("translations__name",)
        assert self.admin.search_fields == search_fields

    def test_form(self) -> None:
        assert self.admin.form == FilterTypeForm

    def test_inlines(self) -> None:
        inlines = (FilterValueInline,)
        assert self.admin.inlines == inlines

    def test_get_queryset(self, rf: RequestFactory) -> None:
        request = rf.get(self.app_url)
        qs = self.admin.get_queryset(request)

        select_related = qs.query.select_related
        pref_lookups = qs._prefetch_related_lookups  # type: ignore[attr-defined]
        assert isinstance(select_related, bool) and isinstance(pref_lookups, tuple)

        # Check that filtering and sorting are set correctly
        assert not select_related
        assert "filter_values" and "filter_values__translations" in pref_lookups

    def test_display_name(self, mocker: MockerFixture) -> None:
        # Mock object
        name = "Test Name"
        obj = mocker.Mock()
        obj.filter_name = name

        # Call `display_name` method
        display_value = self.admin.display_name(obj)

        # Check that `display_name` returns the correct value
        assert display_value == name

    def test_display_filter_values(self, mocker: MockerFixture) -> None:
        # Mock object
        obj = mocker.Mock()

        # Call `display_filter_values` method
        display_value = self.admin.display_filter_values(obj)

        # Check that `display_filter_type` calls and returns the mocked value
        assert display_value == "mocked_display_value"
