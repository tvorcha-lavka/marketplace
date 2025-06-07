from typing import Sequence

from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.db.models import QuerySet
from django.http import HttpRequest
from django.utils.translation import gettext_lazy as _
from mptt.admin import MPTTModelAdmin
from parler.admin import TranslatableAdmin

from apps.filter.forms import FilterGroupInline

from .filters import HasImageFilter, ParentCategoryFilter
from .forms import (
    CardImageInline,
    CategoryAdminForm,
    CategoryCardAdminForm,
    CategoryImageInline,
    CategoryStatisticInline,
)
from .managers import CategoryQuerySet
from .models import Card, Category


@admin.register(Category)
class CategoryAdmin(TranslatableAdmin[Category], MPTTModelAdmin[Category]):  # type: ignore[misc]
    # list settings
    list_display = ("id", "__str__", "parent_id", "parent", "order", "active", "all_languages_column")
    list_filter = ("active", HasImageFilter, ParentCategoryFilter)
    list_display_links = ("__str__", "parent")
    search_fields = ("translations__title",)  # noqa
    ordering = ("id",)

    # object settings
    form = CategoryAdminForm
    inlines = (FilterGroupInline, CategoryImageInline, CategoryStatisticInline)

    def get_prepopulated_fields(self, request: HttpRequest, obj: Category | None = None) -> dict[str, Sequence[str]]:
        return {"slug": ("title",), "url": ("slug",)}

    def get_queryset(self, request: HttpRequest) -> CategoryQuerySet:
        qs: CategoryQuerySet = super().get_queryset(request)

        if request.path.endswith("/category/"):
            return qs.select_related("parent").prefetch_related("parent__translations")

        return qs


@admin.register(Card)
class CategoryCardAdmin(ModelAdmin[Card]):
    # list settings
    list_display = ("__str__", "orientation", "is_card_image")
    list_display_links = ("__str__",)
    list_filter = (HasImageFilter,)

    # object settings
    form = CategoryCardAdminForm
    inlines = (CardImageInline,)

    @admin.display(description=_("Image exists"))
    def is_card_image(self, obj: Card) -> bool:
        return bool(obj.image.image) if hasattr(obj, "image") else False

    def get_queryset(self, request: HttpRequest) -> QuerySet[Card]:
        qs = super().get_queryset(request)
        return qs.select_related("category", "image").prefetch_related("category__translations")
