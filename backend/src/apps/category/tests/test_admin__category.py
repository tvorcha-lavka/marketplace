import pytest
from django.test import RequestFactory
from parler.admin import BaseTranslatableAdmin
from parler.managers import TranslatableQuerySet
from pytest_mock import MockerFixture

from apps.admin.sites import AdminSite
from apps.category.admin import CategoryAdmin
from apps.category.filters import HasImageFilter, ParentCategoryFilter
from apps.category.forms import CategoryAdminForm, CategoryImageInline, CategoryStatisticInline
from apps.category.models import Category
from apps.filter.forms import FilterGroupInline


class TestCategoryAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker: MockerFixture) -> None:
        self.site = AdminSite()
        self.model = Category
        self.app_url = "/admin/category/category/"
        self.admin = CategoryAdmin(self.model, self.site)
        mocker.patch.object(BaseTranslatableAdmin, "get_queryset", return_value=TranslatableQuerySet())

    def test_list_display(self) -> None:
        list_display = ("id", "__str__", "parent_id", "parent", "order", "active", "all_languages_column")
        assert self.admin.list_display == list_display

    def test_list_display_links(self) -> None:
        list_display_links = ("__str__", "parent")
        assert self.admin.list_display_links == list_display_links

    def test_list_filter(self) -> None:
        list_filter = ("active", HasImageFilter, ParentCategoryFilter)
        assert self.admin.list_filter == list_filter

    def test_search_fields(self) -> None:
        search_fields = ("translations__title",)
        assert self.admin.search_fields == search_fields

    def test_form(self) -> None:
        form = CategoryAdminForm
        assert self.admin.form == form

    def test_inlines(self) -> None:
        inlines = (FilterGroupInline, CategoryImageInline, CategoryStatisticInline)
        assert self.admin.inlines == inlines

    def test_get_prepopulated_fields(self, rf: RequestFactory) -> None:
        request = rf.get(self.app_url)
        prepopulated_fields = self.admin.get_prepopulated_fields(request)

        assert prepopulated_fields == {"slug": ("title",), "url": ("slug",)}

    def test_get_queryset_for_list(self, rf: RequestFactory) -> None:
        request = rf.get(self.app_url)
        qs = self.admin.get_queryset(request)

        select_related = qs.query.select_related
        pref_lookups = qs._prefetch_related_lookups

        assert isinstance(select_related, dict) and isinstance(pref_lookups, tuple)

        assert "parent" in select_related
        assert "translations" and "parent__translations" in pref_lookups

    def test_get_queryset_for_change(self, rf: RequestFactory) -> None:
        request = rf.get(self.app_url + "%s/change/" % 1)
        qs = self.admin.get_queryset(request)

        select_related = qs.query.select_related
        pref_lookups = qs._prefetch_related_lookups

        assert isinstance(select_related, bool) and isinstance(pref_lookups, tuple)

        assert not select_related
        assert "translations" in pref_lookups
        assert "parent__translations" not in pref_lookups
