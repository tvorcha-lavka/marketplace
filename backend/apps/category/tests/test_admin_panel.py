import pytest
from django import forms

from apps.category.admin import CategoryAdminForm
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
