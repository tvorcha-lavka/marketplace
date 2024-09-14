import pytest
from django import forms
from django.contrib.admin import AdminSite

from apps.category.admin import CategoryAdmin, CategoryAdminForm
from apps.category.models import Category


@pytest.mark.django_db
class TestCategoryAdminForm:
    def test_name_field_hidden_when_name_is_none(self):
        form = CategoryAdminForm(data={}, instance=Category(name=None))
        assert isinstance(form.fields["name"].widget, forms.HiddenInput)

    def test_name_field_help_text_when_href_is_set(self, settings):
        settings.BASE_FRONTEND_URL = "https://example.com"

        category = Category(name="Test", href="/test-url")
        form = CategoryAdminForm(instance=category)

        assert form.fields["name"].help_text == "https://example.com/test-url"

    def test_order_field_help_text(self):
        form = CategoryAdminForm(instance=Category(name="Test"))

        expected_help_text = (
            "This parameter is responsible for the location of the category.\n"
            "The smaller the number, the higher the category in the list.\n"
            "Sorting occurs by [order] and tree [level]."
        )
        assert form.fields["order"].help_text == expected_help_text


@pytest.mark.django_db
@pytest.mark.usefixtures("migrate_categories")
class TestCategoryAdmin:

    @pytest.fixture
    def category_admin(self):
        return CategoryAdmin(Category, AdminSite())

    def test_title_display(self, category_admin):
        category = Category.objects.first()
        assert category_admin.title_display(category) == category.title

    def test_parent_display_with_parent(self, category_admin):
        category = Category.objects.filter(parent=True).first()
        assert category_admin.parent_display(category) == category.parent.title

    def test_parent_display_without_parent(self, category_admin):
        category = Category.objects.filter(parent=None).first()
        assert category_admin.parent_display(category) is None

    def test_get_queryset(self, category_admin, rf):
        language_code = "en"
        headers = {"Accept-Language": language_code}
        request = rf.get("/admin/category/category/", headers=headers)

        queryset = category_admin.get_queryset(request)

        assert queryset._language == language_code
        assert "parent" in queryset.query.select_related
        assert "translations" and "parent__translations" in queryset._prefetch_related_lookups
