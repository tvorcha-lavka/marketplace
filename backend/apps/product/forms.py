from django import forms
from django.contrib import admin

from .models import Product, ProductImage


class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ("title", "description", "category", "price", "active", "is_vip", "date_published", "filters")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self._meta.formfield_callback.keywords.get("request")  # type: ignore
        lang = request.GET.get("language", request.LANGUAGE_CODE)

        category_qs = self.fields["category"].queryset
        self.fields["category"].queryset = category_qs.language(lang).prefetch_related("translations")

        filters_qs = self.fields["filters"].queryset
        self.fields["filters"].queryset = (
            filters_qs.language(lang)
            .select_related("filter_type")
            .prefetch_related("translations", "filter_type__translations")
        )


class ProductImageInline(admin.TabularInline):
    fields = ("image", "priority")
    ordering = ("priority",)
    model = ProductImage
    extra = 0
    max_num = 10
