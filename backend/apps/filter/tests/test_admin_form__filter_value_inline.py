import pytest
from parler.admin import TranslatableTabularInline
from parler.managers import TranslatableQuerySet

from apps.admin.sites import AdminSite
from apps.filter.forms import FilterValueForm, FilterValueInline
from apps.filter.models import FilterValue


class TestFilterValueInline:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.site = AdminSite()
        self.model = FilterValue
        self.inline = FilterValueInline(self.model, self.site)
        self.app_url = "/admin/filter/filtervalue/"
        mocker.patch.object(TranslatableTabularInline, "get_queryset", return_value=TranslatableQuerySet(FilterValue))

    def test_model(self):
        assert self.inline.model == FilterValue

    def test_form(self):
        assert self.inline.form == FilterValueForm

    def test_extra(self):
        assert self.inline.extra == 0

    def test_get_queryset(self, rf):
        request = rf.get(self.app_url)
        queryset = self.inline.get_queryset(request)

        # Check that the required fields for `select_related` and `prefetch_related` are selected
        assert "filter_type" in queryset.query.select_related
        assert "translations" and "filter_type__translations" in queryset._prefetch_related_lookups
