import pytest
from parler.admin import TranslatableAdmin
from parler.managers import TranslatableQuerySet

from apps.admin.sites import AdminSite
from apps.filter.admin import FilterTypeAdmin
from apps.filter.forms import FilterTypeForm
from apps.filter.models import FilterType


class TestFilterTypeAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.site = AdminSite()
        self.model = FilterType
        self.admin = FilterTypeAdmin(self.model, self.site)
        self.app_url = "/admin/filter/filtertype/"

        # Mock the `_display_list_field` method
        mocker.patch.object(self.admin, "_display_list_field", return_value="mocked_display_value")

        # Mock queryset for TranslatableAdmin
        mocker.patch.object(TranslatableAdmin, "get_queryset", return_value=TranslatableQuerySet(self.model))

    def test_list_display(self):
        list_display = ("display_name", "display_filter_values", "all_languages_column")
        assert self.admin.list_display == list_display

    def test_search_fields(self):
        search_fields = ("translations__name",)
        assert self.admin.search_fields == search_fields

    def test_form(self):
        assert self.admin.form == FilterTypeForm

    def test_get_queryset(self, rf):
        request = rf.get(self.app_url)

        # Get model queryset
        queryset = self.admin.get_queryset(request)

        # Check that filtering and sorting are set correctly
        assert not queryset.query.select_related
        assert "values" and "values__translations" in queryset._prefetch_related_lookups

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

    def test_display_filter_values(self, mocker):
        # Mock object
        obj = mocker.Mock()

        # Call `display_filter_values` method
        display_value = self.admin.display_filter_values(obj)

        # Check that `display_filter_type` calls and returns the mocked value
        assert display_value == "mocked_display_value"
