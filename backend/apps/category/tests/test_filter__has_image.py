import pytest
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _

from apps.category.admin import CategoryAdmin
from apps.category.filters import HasImageFilter
from apps.category.models import Category


@pytest.mark.django_db
class TestHasImageFilterBase:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.app_url = "/admin/category/category/"
        self.filter = HasImageFilter(None, [], Category, CategoryAdmin)

    def test_lookups(self):
        lookups = (("yes", _("Exists")), ("no", _("Does not exist")))
        assert self.filter.lookups(None, None) == lookups

    @pytest.mark.parametrize("value", ("yes", "no", None))
    def test_queryset(self, mocker, rf, category_queryset, value):
        mocker.patch.object(self.filter, "value", return_value=value)
        filtered_queryset = self.filter.queryset(rf.get(self.app_url), category_queryset)

        def has_image(item):
            try:
                return item.image is not None
            except ObjectDoesNotExist:
                return False

        if value == "yes":  # Expect that all elements have an image
            assert all(has_image(item) for item in filtered_queryset)

        elif value == "no":  # Expect that all elements without an image
            assert all(not has_image(item) for item in filtered_queryset)

        else:  # Expect the original queryset to be returned
            assert filtered_queryset == category_queryset
