import pytest
from parler.admin import BaseTranslatableAdmin
from parler.managers import TranslatableQuerySet

from apps.admin.sites import AdminSite
from apps.category.admin import CategoryCardAdmin
from apps.category.filters import HasImageFilter
from apps.category.forms import CardImageInline, CategoryCardAdminForm
from apps.category.models import Card, CardImage, Category


class TestCategoryCardAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.site = AdminSite()
        self.model = Card
        self.app_url = "/admin/category/card/"
        self.admin = CategoryCardAdmin(self.model, self.site)
        mocker.patch.object(BaseTranslatableAdmin, "get_queryset", return_value=TranslatableQuerySet())

    def test_list_display(self):
        list_display = ("__str__", "orientation", "is_card_image")
        assert self.admin.list_display == list_display

    def test_list_display_links(self):
        list_display_links = ("__str__",)
        assert self.admin.list_display_links == list_display_links

    def test_list_filter(self):
        list_filter = (HasImageFilter,)
        assert self.admin.list_filter == list_filter

    def test_form(self):
        form = CategoryCardAdminForm
        assert self.admin.form == form

    def test_inlines(self):
        inlines = (CardImageInline,)
        assert self.admin.inlines == inlines

    def test_is_card_image(self, mocker):
        card = Card(category=Category())
        assert not self.admin.is_card_image(card)

        image = CardImage(card=card, image="test_image.jpg")
        mocker.patch.object(CardImage.objects, "create", return_value=image)

        assert self.admin.is_card_image(card)

    def test_get_queryset(self, rf):
        request = rf.get("/admin/category/card/")
        queryset = self.admin.get_queryset(request)

        assert "category" and "image" in queryset.query.select_related
        assert "category__translations" in queryset._prefetch_related_lookups
