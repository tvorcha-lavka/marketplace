import pytest
from parler.admin import TranslatableAdmin
from parler.managers import TranslatableQuerySet

from apps.admin.sites import AdminSite
from apps.filter.admin import FilterGroupAdmin
from apps.filter.filters import FilterTypeFilterAdmin
from apps.filter.forms import FilterGroupForm
from apps.filter.models import FilterGroup


class TestFilterGroupAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.site = AdminSite()
        self.model = FilterGroup
        self.admin = FilterGroupAdmin(self.model, self.site)
        self.app_url = "/admin/filter/filtergroup/"

        # Mock the `_display_list_field` and `_display_field` methods
        mocker.patch.object(self.admin, "_display_field", return_value="mocked_display_value")
        mocker.patch.object(self.admin, "_display_list_field", return_value="mocked_display_value")

        # Mock queryset for TranslatableAdmin
        mocker.patch.object(TranslatableAdmin, "get_queryset", return_value=TranslatableQuerySet(self.model))

    def test_list_display(self):
        list_display = ("category", "display_filter_type", "display_filter_values")
        assert self.admin.list_display == list_display

    def test_list_filter(self):
        list_filter = (FilterTypeFilterAdmin,)
        assert self.admin.list_filter == list_filter

    def test_search_fields(self):
        search_fields = ("category__translations__name", "filter_type__translations__name")
        assert self.admin.search_fields == search_fields

    def test_form(self):
        assert self.admin.form == FilterGroupForm

    def test_filter_horizontal(self):
        filter_horizontal = ("filter_values",)
        assert self.admin.filter_horizontal == filter_horizontal

    def test_get_queryset(self, rf):
        select_related_values = ["category", "filter_type"]
        prefetch_related_values = [
            "category__translations",
            "filter_type__translations",
            "filter_values__translations",
        ]

        request_1 = rf.get(self.app_url)
        request_2 = rf.get(self.app_url + "1/change/")

        # Get model queryset
        queryset_1 = self.admin.get_queryset(request_1)
        queryset_2 = self.admin.get_queryset(request_2)

        # Check that filtering and sorting are set correctly
        assert not queryset_1.query.select_related
        assert all(lookup in queryset_1._prefetch_related_lookups for lookup in prefetch_related_values)

        assert all(lookup in queryset_2.query.select_related for lookup in select_related_values)
        assert all(lookup not in queryset_2._prefetch_related_lookups for lookup in prefetch_related_values)

    def test_display_filter_type(self, mocker):
        # Mock object
        obj = mocker.Mock()

        # Call `display_filter_type` method
        display_value = self.admin.display_filter_type(obj)

        # Check that `display_filter_type` calls and returns the mocked value
        assert display_value == "mocked_display_value"

    def test_display_filter_values(self, mocker):
        # Mock object
        obj = mocker.Mock()

        # Call `display_filter_values` method
        display_value = self.admin.display_filter_values(obj)

        # Check that `display_filter_type` calls and returns the mocked value
        assert display_value == "mocked_display_value"
