import pytest
from django.test import RequestFactory
from parler.admin import TranslatableTabularInline
from parler.managers import TranslatableQuerySet
from pytest_mock import MockerFixture

from apps.admin.sites import AdminSite
from apps.filter.forms import FilterValueForm, FilterValueInline
from apps.filter.models import FilterValue


class TestFilterValueInline:
    @pytest.fixture(autouse=True)
    def setup(self, mocker: MockerFixture) -> None:
        self.site = AdminSite()
        self.model = FilterValue
        self.inline = FilterValueInline(self.model, self.site)
        self.app_url = "/admin/filter/filtervalue/"
        mocker.patch.object(TranslatableTabularInline, "get_queryset", return_value=TranslatableQuerySet(FilterValue))

    def test_model(self) -> None:
        assert self.inline.model == FilterValue

    def test_form(self) -> None:
        assert self.inline.form == FilterValueForm

    def test_extra(self) -> None:
        assert self.inline.extra == 0

    def test_get_queryset(self, rf: RequestFactory) -> None:
        request = rf.get(self.app_url)

        # Get model queryset
        qs = self.inline.get_queryset(request)

        select_related = qs.query.select_related
        pref_lookups = qs._prefetch_related_lookups  # type: ignore[attr-defined]
        assert isinstance(select_related, dict) and isinstance(pref_lookups, tuple)

        # Check that the required fields for `select_related` and `prefetch_related` are selected
        assert "filter_type" in select_related
        assert "translations" and "filter_type__translations" in pref_lookups
