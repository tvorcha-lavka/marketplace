from typing import Any

from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.db.models import QuerySet
from django.http import HttpRequest

from apps.product.forms import ProductAdminForm, ProductImageAdminForm, ProductImageInline
from apps.product.models import Product, ProductImage


@admin.register(Product)
class ProductAdmin(ModelAdmin[Product]):
    # list settings
    list_display = ("id", "owner", "category", "price", "active", "is_vip")
    list_display_links = ("id",)

    # object settings
    form = ProductAdminForm
    inlines = (ProductImageInline,)
    filter_horizontal = ("filters",)
    readonly_fields = ("date_published",)

    def save_model(self, request: HttpRequest, obj: Product, form: Any, change: Any) -> None:
        if not change:
            obj.owner_id = request.user.pk
        super().save_model(request, obj, form, change)

    def get_queryset(self, request: HttpRequest) -> QuerySet[Product]:
        qs = super().get_queryset(request)

        if request.path.endswith("/product/"):
            return qs.select_related("owner", "category").prefetch_related("category__translations")

        return qs


@admin.register(ProductImage)
class ProductImageAdmin(ModelAdmin[ProductImage]):
    form = ProductImageAdminForm

    def get_queryset(self, request: HttpRequest) -> QuerySet[ProductImage]:
        return super().get_queryset(request).select_related("product")
