from django import forms
from django.conf import settings
from django.contrib import admin
from django.utils.translation import get_language_from_request
from django.utils.translation import gettext_lazy as _
from mptt.admin import MPTTModelAdmin
from mptt.forms import MPTTAdminForm  # noqa
from parler.admin import TranslatableAdmin, TranslatableModelForm  # noqa

from .models import Category, CategoryImage

admin.site.register(CategoryImage)


class CategoryAdminForm(MPTTAdminForm, TranslatableModelForm):
    class Meta:
        model = Category
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        instance = kwargs.get("instance")

        if not instance or not instance.name:
            self.fields["name"].widget = forms.HiddenInput()

        if instance and instance.href:
            base_url = settings.BASE_FRONTEND_URL
            self.fields["name"].help_text = base_url + instance.href

        self.fields["order"].help_text = _(
            "This parameter is responsible for the location of the category.\n"
            "The smaller the number, the higher the category in the list.\n"
            "Sorting occurs by [order] and tree [level]."
        )


class ImageInline(admin.StackedInline):
    model = CategoryImage
    extra = 1
    max_num = 1


@admin.register(Category)
class CategoryAdmin(TranslatableAdmin, MPTTModelAdmin):
    form = CategoryAdminForm

    list_display = ("id", "title_display", "parent_id", "parent_display", "order", "active")
    list_display_links = ("title_display", "parent_display")
    list_filter = ("level", "active", "parent")
    search_fields = ("translations__title", "name")
    list_per_page = 25

    fieldsets = [(None, {"fields": ("title", "name", "parent", "active", "order")})]
    inlines = [ImageInline]

    @staticmethod
    @admin.display(description="Category")
    def title_display(obj):
        return obj.title

    @staticmethod
    @admin.display(description="Parent")
    def parent_display(obj):
        return obj.parent.title if obj.parent else None

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("parent")
            .prefetch_related("translations", "parent__translations")
            .language(get_language_from_request(request))
        )
