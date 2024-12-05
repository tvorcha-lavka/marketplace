from django.contrib.admin.sites import AdminSite
from django.contrib.auth.models import AnonymousUser

from apps.category.forms import CardImageInline
from apps.category.models import CardImage


class TestCardImageInline:
    def setup_method(self):
        self.site = AdminSite()
        self.inline = CardImageInline(parent_model=CardImage, admin_site=self.site)

    def test_get_queryset(self, rf):
        request = rf.get("/admin/category/cardimage/")
        request.user = AnonymousUser()

        queryset = self.inline.get_queryset(request)

        assert "card" in queryset.query.select_related
        assert "category" in queryset.query.select_related["card"]
        assert "card__category__translations" in queryset._prefetch_related_lookups
