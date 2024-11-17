import pytest
from parler.admin import TranslatableAdmin
from parler.managers import TranslatableQuerySet

from apps.admin.sites import AdminSite
from apps.filter.admin import FilterValueAdmin
from apps.filter.filters import FilterTypeFilterAdmin
from apps.filter.forms import FilterValueForm
from apps.filter.models import FilterValue


class TestFilterValueAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.site = AdminSite()
        self.model = FilterValue
        self.admin = FilterValueAdmin(self.model, self.site)
        self.app_url = "/admin/filter/filtervalue/"

        # Mock the `_display_field` method
        mocker.patch.object(self.admin, "_display_field", return_value="mocked_display_value")

        # Mock queryset for TranslatableAdmin
        mocker.patch.object(TranslatableAdmin, "get_queryset", return_value=TranslatableQuerySet(self.model))

    def test_list_display(self):
        list_display = ("display_filter_type", "value", "description", "all_languages_column")
        assert self.admin.list_display == list_display

    def test_list_display_links(self):
        list_display_links = ("value",)
        assert self.admin.list_display_links == list_display_links

    def test_list_filter(self):
        list_filter = (FilterTypeFilterAdmin,)
        assert self.admin.list_filter == list_filter

    def test_search_fields(self):
        search_fields = ("filter_type__translations__name", "translations__value")
        assert self.admin.search_fields == search_fields

    def test_form(self):
        assert self.admin.form == FilterValueForm

    def test_get_queryset(self, rf):
        request = rf.get(self.app_url)

        # Get model queryset
        queryset = self.admin.get_queryset(request)

        # Check that filtering and sorting are set correctly
        assert "filter_type" in queryset.query.select_related
        assert "translations" and "filter_type__translations" in queryset._prefetch_related_lookups
        assert queryset.query.distinct

    def test_display_filter_type(self, mocker):
        # Mock object
        obj = mocker.Mock()

        # Call `display_filter_type` method
        display_value = self.admin.display_filter_type(obj)

        # Check that `display_filter_type` calls and returns the mocked value
        assert display_value == "mocked_display_value"
