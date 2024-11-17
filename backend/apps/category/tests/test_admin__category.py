import pytest
from parler.admin import BaseTranslatableAdmin
from parler.managers import TranslatableQuerySet

from apps.admin.sites import AdminSite
from apps.category.admin import CategoryAdmin
from apps.category.filters import HasImageFilter, ParentCategoryFilter
from apps.category.forms import CategoryAdminForm, CategoryImageInline, CategoryStatisticInline
from apps.category.models import Category

# from apps.filter.forms import FilterGroupInline


class TestCategoryAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.site = AdminSite()
        self.model = Category
        self.app_url = "/admin/category/category/"
        self.admin = CategoryAdmin(self.model, self.site)
        mocker.patch.object(BaseTranslatableAdmin, "get_queryset", return_value=TranslatableQuerySet())

    def test_list_display(self):
        list_display = ("id", "__str__", "parent_id", "parent", "order", "active", "all_languages_column")
        assert self.admin.list_display == list_display

    def test_list_display_links(self):
        list_display_links = ("__str__", "parent")
        assert self.admin.list_display_links == list_display_links

    def test_list_filter(self):
        list_filter = ("active", HasImageFilter, ParentCategoryFilter)
        assert self.admin.list_filter == list_filter

    def test_search_fields(self):
        search_fields = ("translations__title",)
        assert self.admin.search_fields == search_fields

    def test_form(self):
        form = CategoryAdminForm
        assert self.admin.form == form

    def test_inlines(self):
        inlines = (CategoryImageInline, CategoryStatisticInline)
        assert self.admin.inlines == inlines

    def test_get_prepopulated_fields(self, rf):
        request = rf.get(self.app_url)
        prepopulated_fields = self.admin.get_prepopulated_fields(request)

        assert prepopulated_fields == {"slug": ("title",), "url": ("slug",)}

    def test_get_queryset_for_list(self, rf):
        request = rf.get(self.app_url)
        queryset = self.admin.get_queryset(request)

        assert "parent" in queryset.query.select_related
        assert "translations" and "parent__translations" in queryset._prefetch_related_lookups

    def test_get_queryset_for_change(self, rf):
        request = rf.get(self.app_url + "%s/change/" % 1)
        queryset = self.admin.get_queryset(request)

        assert not queryset.query.select_related
        assert "translations" in queryset._prefetch_related_lookups
        assert "parent__translations" not in queryset._prefetch_related_lookups
