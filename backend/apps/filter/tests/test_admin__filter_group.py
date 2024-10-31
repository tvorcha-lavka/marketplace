import pytest
from parler.admin import TranslatableAdmin
from parler.managers import TranslatableQuerySet

from apps.admin.sites import AdminSite
from apps.filter.admin import FilterGroupAdmin
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
        list_display = ("display_name", "display_filter_type", "display_filter_values", "all_languages_column")
        assert self.admin.list_display == list_display

    def test_list_filter(self):
        list_filter = ("filter_type",)
        assert self.admin.list_filter == list_filter

    def test_search_fields(self):
        search_fields = ("translations__name",)
        assert self.admin.search_fields == search_fields

    def test_form(self):
        assert self.admin.form == FilterGroupForm

    def test_get_queryset(self, rf):
        request = rf.get(self.app_url)

        # Get model queryset
        queryset = self.admin.get_queryset(request)

        # Check that filtering and sorting are set correctly
        assert "filter_type" in queryset.query.select_related
        assert "filter_type__translations" and "filter_values__translations" in queryset._prefetch_related_lookups

    def test_get_prepopulated_fields(self, rf):
        request = rf.get(self.app_url)
        prepopulated_fields = self.admin.get_prepopulated_fields(request)

        # Check that the slug is generated based on the value field
        assert prepopulated_fields == {"slug": ("name",)}

    def test_display_name(self, mocker):
        # Mock object
        name = "Test Name"
        obj = mocker.Mock()
        obj.name = name

        # Call `display_name` method
        display_value = self.admin.display_name(obj)

        # Check that `display_name` returns correct value
        assert display_value == name

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
