from django.contrib import admin
from parler.admin import TranslatableAdmin

from apps.product.forms import ProductAdminForm, ProductImageInline
from apps.product.models import Product, ProductImage


@admin.register(Product)
class ProductAdmin(TranslatableAdmin):
    # list settings
    list_display = ("id", "seller", "category", "price", "active", "is_vip")
    list_display_links = ("id",)

    # object settings
    form = ProductAdminForm
    inlines = (ProductImageInline,)
    filter_horizontal = ("filters",)
    readonly_fields = ("date_published",)

    def save_model(self, request, obj, form, change):
        if not change:
            obj.seller = request.user
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        if request.path.endswith("/product/"):
            return qs.select_related("seller", "category").prefetch_related("category__translations")

        return qs.prefetch_related("translations")


# TODO: нужно оптимизировать метод `get_queryset` для ProductImage
admin.site.register(ProductImage)
