from typing import cast

import pytest
from django.forms import HiddenInput, ModelChoiceField, Select

from apps.category.forms import CategoryCardAdminForm
from apps.category.models import Card, Category


class TestCategoryCardAdminForm:

    @pytest.mark.parametrize("test_with_card, expected_widget", ((True, HiddenInput), (False, Select)))
    def test_init_form(self, test_with_card: bool, expected_widget: type[HiddenInput | Select]) -> None:
        # Create category card instance
        category = Category(id=1, title="Test Category")  # type: ignore[misc]
        card = Card(id=1, category=category) if test_with_card else None

        # Form initialization
        form = CategoryCardAdminForm(instance=card)
        field = cast(ModelChoiceField[Category], form.fields["category"])
        queryset = field.queryset

        # Check that the correct queryset has been assigned
        assert queryset is not None
        assert hasattr(queryset, "_prefetch_related_lookups")

        assert not queryset.query.select_related
        assert "translations" in queryset._prefetch_related_lookups

        # Check that the widget is correctly installed
        assert isinstance(field.widget, expected_widget)
