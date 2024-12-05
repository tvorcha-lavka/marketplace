import pytest
from django.forms import HiddenInput, Select

from apps.category.admin import CategoryCardAdminForm
from apps.category.models import Card, Category


class TestCategoryCardAdminForm:
    @pytest.mark.parametrize("test_with_card, expected_widget", ((True, HiddenInput), (False, Select)))
    def test_init_form(self, test_with_card, expected_widget):
        # Create category card instance
        category = Category(id=1, title="Test Category")
        card = Card(id=1, category=category) if test_with_card else None

        # Form initialization
        form = CategoryCardAdminForm(instance=card)

        # Check that the correct queryset has been assigned
        queryset = form.fields["category"].queryset
        assert not queryset.query.select_related
        assert "translations" in queryset._prefetch_related_lookups

        # Check that the widget is correctly installed
        assert isinstance(form.fields["category"].widget, expected_widget)
