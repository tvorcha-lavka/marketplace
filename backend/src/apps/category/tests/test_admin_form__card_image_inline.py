from django.contrib.admin.sites import AdminSite
from django.contrib.auth.models import AnonymousUser
from django.test import RequestFactory

from apps.category.forms import CardImageInline
from apps.category.models import Card


class TestCardImageInline:
    def setup_method(self) -> None:
        self.site = AdminSite()
        self.inline = CardImageInline(parent_model=Card, admin_site=self.site)

    def test_get_queryset(self, rf: RequestFactory) -> None:
        request = rf.get("/admin/category/cardimage/")
        request.user = AnonymousUser()

        qs = self.inline.get_queryset(request)

        select_related = qs.query.select_related
        pref_lookups = qs._prefetch_related_lookups  # type: ignore[attr-defined]

        assert isinstance(select_related, dict) and isinstance(pref_lookups, tuple)

        assert "card" in select_related
        assert "category" in select_related["card"]
        assert "card__category__translations" in pref_lookups
