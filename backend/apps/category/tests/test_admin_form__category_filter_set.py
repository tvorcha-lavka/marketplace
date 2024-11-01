import pytest
from parler.managers import TranslatableQuerySet

from apps.category.forms import CategoryFilterSetAdminForm
from apps.category.models import CategoryFilterSet


class TestCategoryFilterSetAdminForm:
    @pytest.fixture(autouse=True)
    def setup(self, mocker, rf):
        # Create mock for category filterset instance
        self.mocked_instance = mocker.MagicMock(spec=CategoryFilterSet)
        mocked_meta = mocker.patch.object(CategoryFilterSetAdminForm._meta, "formfield_callback")

        # Create request
        response = rf.get("/admin/category/category/add/?language=en")
        response.LANGUAGE_CODE = "en"
        mocked_meta.keywords.get.return_value = response

    def test_init_form(self):
        # Form initialization
        form = CategoryFilterSetAdminForm(instance=self.mocked_instance)

        # Check that the "filters" field contains a valid queryset
        filters_qs = form.fields["filters"].queryset
        assert isinstance(filters_qs, TranslatableQuerySet)
        assert filters_qs._query.select_related is False
        assert filters_qs._prefetch_related_lookups == ("translations", "groups__translations")
