import pytest
from django.conf import settings
from django.forms import BaseModelForm
from parler.forms import BaseTranslatableModelForm

from apps.category.forms import CategoryAdminForm
from apps.category.managers import CategoryQuerySet
from apps.category.models import Category


class TestCategoryAdminForm:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        # Create mock for category instance
        self.mocked_instance = mocker.MagicMock(spec=Category)
        self.mocked_instance.url = "/category-name"

        # Mock to exclude method calls that work with `queryset` in the parler
        mocker.patch.object(BaseTranslatableModelForm, "__init__", new=BaseModelForm.__init__)

    def test_init_form(self):
        # Form initialization
        form = CategoryAdminForm(instance=self.mocked_instance)

        # Checking that the "url" field is properly initialized and disabled
        assert form.initial["url"] == settings.BASE_FRONTEND_URL + self.mocked_instance.url
        assert form.fields["url"].disabled is True

        # Check that the "parent" field contains a valid queryset
        parent_qs = form.fields["parent"].queryset
        assert isinstance(parent_qs, CategoryQuerySet)
        assert parent_qs._query.order_by == ("pk",)
        assert parent_qs._query.select_related is False
        assert parent_qs._prefetch_related_lookups == ("translations",)
