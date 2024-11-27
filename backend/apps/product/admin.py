from django.contrib import admin

from apps.product.forms import ProductAdminForm, ProductImageAdminForm, ProductImageInline
from apps.product.models import Product, ProductImage


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # list settings
    list_display = ("id", "owner", "category", "price", "active", "is_vip")
    list_display_links = ("id",)

    # object settings
    form = ProductAdminForm
    inlines = (ProductImageInline,)
    filter_horizontal = ("filters",)
    readonly_fields = ("date_published",)

    def save_model(self, request, obj, form, change):
        if not change:
            obj.owner = request.user
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        if request.path.endswith("/product/"):
            return qs.select_related("owner", "category").prefetch_related("category__translations")

        return qs


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    form = ProductImageAdminForm

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("product")
