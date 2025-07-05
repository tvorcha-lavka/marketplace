import hashlib
from typing import Any, cast

from django.contrib.admin import TabularInline
from django.db.models import QuerySet
from django.forms import ImageField, ModelChoiceField, ModelForm
from django.http import HttpRequest
from django.utils.html import format_html_join
from django.utils.translation import gettext_lazy as _
from parler.managers import TranslatableQuerySet

from apps.category.managers import CategoryQuerySet
from apps.category.models import Category
from apps.filter.models import FilterValue

from .models import Product, ProductImage


class ProductAdminForm(ModelForm[Product]):
    class Meta:
        model = Product
        fields = ("title", "description", "category", "price", "draft", "is_vip", "date_published", "filters")

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)

        category_field = cast(ModelChoiceField[Category], self.fields["category"])
        filters_field = cast(ModelChoiceField[FilterValue], self.fields["filters"])

        # fmt: off
        category_field.queryset = (
            cast(CategoryQuerySet, category_field.queryset)
            .prefetch_related("translations")
        )
        filters_field.queryset = (
            cast(TranslatableQuerySet[FilterValue], filters_field.queryset)
            .select_related("filter_type")
            .prefetch_related("translations", "filter_type__translations")
        )
        # fmt: on


class ProductImageAdminForm(ModelForm[ProductImage]):
    class Meta:
        model = ProductImage
        fields = ["product", "upload_image", "priority"]

    upload_image = ImageField(label=_("Upload image"), required=True)

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)

        # noinspection PyProtectedMember
        if not self.instance._state.adding:
            self.fields["upload_image"].required = False

    def save(self, commit: bool = True) -> ProductImage:
        instance = super().save(commit=False)

        # FIXME: not actual upload schema
        # if upload_image := self.cleaned_data.get("upload_image"):
        #     instance.image_temp = upload_image
        #     instance.image_temp._file_hash = self.generate_file_hash(upload_image)
        #
        # instance.save()
        return instance

    @staticmethod
    def generate_file_hash(upload_image: Any) -> str:
        file_hash = hashlib.md5(b"".join(upload_image.chunks())).hexdigest()
        upload_image.seek(0)
        return file_hash


class ProductImageInline(TabularInline[ProductImage, Product]):
    form = ProductImageAdminForm
    model = ProductImage
    extra = 0
    max_num = 10
    ordering = ("priority",)
    readonly_fields = ("thumbnail_preview",)

    @staticmethod
    def thumbnail_preview(obj: ProductImage) -> str:
        return format_html_join(
            sep=", ",
            format_string='<img src="{}" style="max-height: 100px;" />',
            args_generator=[(obj.processed_images_bundle.THUMBNAIL.url,)],
        )

    def get_queryset(self, request: HttpRequest) -> QuerySet[ProductImage]:
        return super().get_queryset(request).select_related("product")
