import hashlib

from django import forms
from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from apps.utils.image.validators import image_validators

from .models import Product, ProductImage


class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ("title", "description", "category", "price", "draft", "is_vip", "date_published", "filters")

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


class ProductImageAdminForm(forms.ModelForm):
    class Meta:
        model = ProductImage
        fields = ["product", "upload_image", "priority"]

    upload_image = forms.ImageField(label=_("Upload image"), required=True, validators=image_validators)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # noinspection PyProtectedMember
        if not self.instance._state.adding:
            self.fields["upload_image"].required = False

    def save(self, commit=True):
        instance = super().save(commit=False)

        if upload_image := self.cleaned_data.get("upload_image"):
            instance.image_temp = upload_image
            instance.image_temp._file_hash = self.generate_file_hash(upload_image)

        instance.save()
        return instance

    @staticmethod
    def generate_file_hash(upload_image):
        hash_md5 = hashlib.md5()
        for chunk in upload_image.chunks():
            hash_md5.update(chunk)
        return hash_md5.hexdigest()


class ProductImageInline(admin.TabularInline):
    form = ProductImageAdminForm
    model = ProductImage
    extra = 0
    max_num = 10
    ordering = ("priority",)
    readonly_fields = ("small_image_preview",)

    @staticmethod
    def small_image_preview(obj):
        return format_html('<img src="{}" style="max-height: 100px;" />', obj.image_small.url)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("product")
