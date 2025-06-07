import pytest
from django.core.exceptions import ObjectDoesNotExist
from django.test import RequestFactory
from django.utils.translation import gettext_lazy as _
from pytest_mock import MockerFixture

from apps.admin.sites import AdminSite
from apps.category.admin import CategoryAdmin
from apps.category.filters import HasImageFilter
from apps.category.managers import CategoryQuerySet
from apps.category.models import Category


@pytest.mark.django_db
class TestHasImageFilterBase:
    @pytest.fixture(autouse=True)
    def setup(self, rf: RequestFactory) -> None:
        self.app_url = "/admin/category/category/"
        self.request = rf.get(self.app_url)
        self.category_admin = CategoryAdmin(Category, AdminSite())
        self.filter = HasImageFilter(self.request, dict(), Category, self.category_admin)

    def test_lookups(self) -> None:
        lookups = (("yes", _("Exists")), ("no", _("Does not exist")))
        assert self.filter.lookups(self.request, self.category_admin) == lookups

    @pytest.mark.parametrize("value", ("yes", "no", None))
    def test_queryset(
        self,
        mocker: MockerFixture,
        category_queryset: CategoryQuerySet,
        value: str | None,
    ) -> None:
        mocker.patch.object(self.filter, "value", return_value=value)
        filtered_queryset = self.filter.queryset(self.request, category_queryset)

        def has_image(item: Category) -> bool:
            try:
                return item.image is not None
            except ObjectDoesNotExist:
                return False

        assert filtered_queryset is not None

        if value == "yes":  # Expect that all elements have an image
            assert all(has_image(item) for item in filtered_queryset)

        elif value == "no":  # Expect that all elements without an image
            assert all(not has_image(item) for item in filtered_queryset)

        else:  # Expect the original queryset to be returned
            assert filtered_queryset == category_queryset
