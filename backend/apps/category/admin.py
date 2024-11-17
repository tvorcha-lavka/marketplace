from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from mptt.admin import MPTTModelAdmin
from parler.admin import TranslatableAdmin, TranslatableModelForm  # noqa

from apps.filter.forms import FilterGroupInline

from .filters import HasImageFilter, ParentCategoryFilter
from .forms import (
    CardImageInline,
    CategoryAdminForm,
    CategoryCardAdminForm,
    CategoryImageInline,
    CategoryStatisticInline,
)
from .models import Card, Category


@admin.register(Category)
class CategoryAdmin(TranslatableAdmin, MPTTModelAdmin):
    # list settings
    list_display = ("id", "__str__", "parent_id", "parent", "order", "active", "all_languages_column")
    list_filter = ("active", HasImageFilter, ParentCategoryFilter)
    list_display_links = ("__str__", "parent")
    search_fields = ("translations__title",)
    ordering = ("pk",)

    # object settings
    form = CategoryAdminForm
    inlines = (FilterGroupInline, CategoryImageInline, CategoryStatisticInline)

    def get_prepopulated_fields(self, request, obj=None):
        return {"slug": ("title",), "url": ("slug",)}

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        if request.path.endswith("/category/"):
            return qs.select_related("parent").prefetch_related("parent__translations")

        return qs


@admin.register(Card)
class CategoryCardAdmin(admin.ModelAdmin):
    # list settings
    list_display = ("__str__", "orientation", "is_card_image")
    list_display_links = ("__str__",)
    list_filter = (HasImageFilter,)

    # object settings
    form = CategoryCardAdminForm
    inlines = (CardImageInline,)

    @admin.display(description=_("Image exists"))
    def is_card_image(self, obj):
        return bool(obj.image.image) if hasattr(obj, "image") else False

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("category")
