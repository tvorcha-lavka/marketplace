from typing import cast

import pytest
from django.conf import settings
from django.forms import BaseModelForm, ModelChoiceField
from parler.forms import BaseTranslatableModelForm
from pytest_mock import MockerFixture

from apps.category.forms import CategoryAdminForm
from apps.category.models import Category


class TestCategoryAdminForm:
    @pytest.fixture(autouse=True)
    def setup(self, mocker: MockerFixture) -> None:
        # Create mock for category instance
        self.mocked_instance = mocker.MagicMock(spec=Category)
        self.mocked_instance.url = "/category-name"

        # Mock to exclude method calls that work with `queryset` in the parler
        mocker.patch.object(BaseTranslatableModelForm, "__init__", new=BaseModelForm.__init__)

    def test_init_form(self) -> None:
        # Form initialization
        form = CategoryAdminForm(instance=self.mocked_instance)

        # Checking that the "url" field is properly initialized and disabled
        assert form.initial["url"] == settings.BASE_FRONTEND_URL + self.mocked_instance.url
        assert form.fields["url"].disabled is True

        field = cast(ModelChoiceField[Category], form.fields["parent"])
        parent_qs = field.queryset

        # Check that the "parent" field contains a valid queryset
        assert parent_qs is not None
        assert hasattr(parent_qs, "_query")
        assert hasattr(parent_qs, "_prefetch_related_lookups")

        assert parent_qs._query.order_by == ("pk",)
        assert parent_qs._query.select_related is False
        assert parent_qs._prefetch_related_lookups == ("translations",)
