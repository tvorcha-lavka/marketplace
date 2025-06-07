import pytest
from django.test import RequestFactory
from parler.admin import BaseTranslatableAdmin
from parler.managers import TranslatableQuerySet
from pytest_mock import MockerFixture

from apps.admin.sites import AdminSite
from apps.category.admin import CategoryCardAdmin
from apps.category.filters import HasImageFilter
from apps.category.forms import CardImageInline, CategoryCardAdminForm
from apps.category.models import Card, CardImage, Category


class TestCategoryCardAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker: MockerFixture) -> None:
        self.site = AdminSite()
        self.model = Card
        self.app_url = "/admin/category/card/"
        self.admin = CategoryCardAdmin(self.model, self.site)
        mocker.patch.object(BaseTranslatableAdmin, "get_queryset", return_value=TranslatableQuerySet())

    def test_list_display(self) -> None:
        list_display = ("__str__", "orientation", "is_card_image")
        assert self.admin.list_display == list_display

    def test_list_display_links(self) -> None:
        list_display_links = ("__str__",)
        assert self.admin.list_display_links == list_display_links

    def test_list_filter(self) -> None:
        list_filter = (HasImageFilter,)
        assert self.admin.list_filter == list_filter

    def test_form(self) -> None:
        form = CategoryCardAdminForm
        assert self.admin.form == form

    def test_inlines(self) -> None:
        inlines = (CardImageInline,)
        assert self.admin.inlines == inlines

    def test_is_card_image(self, mocker: MockerFixture) -> None:
        card = Card(category=Category())
        assert not self.admin.is_card_image(card)

        image = CardImage(card=card, image="test_image.jpg")
        mocker.patch.object(CardImage.objects, "create", return_value=image)

        assert self.admin.is_card_image(card)

    def test_get_queryset(self, rf: RequestFactory) -> None:
        request = rf.get("/admin/category/card/")
        qs = self.admin.get_queryset(request)

        select_related = qs.query.select_related
        pref_lookups = qs._prefetch_related_lookups  # type: ignore[attr-defined]

        assert isinstance(select_related, dict) and isinstance(pref_lookups, tuple)
        assert "category" and "image" in select_related
        assert "category__translations" in pref_lookups
