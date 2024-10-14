from django.contrib import admin
from parler.admin import TranslatableAdmin, TranslatableTabularInline

from .forms import FilterGroupForm, FilterTypeForm, FilterValueForm
from .models import FilterGroup, FilterType, FilterValue


def formfield_for_filter_type_foreignkey(db_field, request, **kwargs):
    language_code = request.GET.get("language", request.LANGUAGE_CODE)
    filter_type_qs = FilterType.objects.language(language_code).prefetch_related("translations")
    kwargs.update({"queryset": filter_type_qs}) if db_field.name == "filter_type" else None

    return kwargs


# ---- Filter Value ----------------------------------------------------------------------------------------------------
class FilterValueInline(TranslatableTabularInline):
    model = FilterValue
    form = FilterValueForm
    extra = 0

    def get_prepopulated_fields(self, request, obj=None):
        return {"slug": ("value",)}

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("filter_type")
            .prefetch_related(
                "translations",
                "filter_type__translations",
            )
        )


@admin.register(FilterValue)
class FilterValueAdmin(TranslatableAdmin):
    # list settings
    list_display = ("filter_type", "value")
    list_display_links = ("filter_type", "value")
    search_fields = ("filter_type__translations__name", "translations__value")

    # object settings
    form = FilterValueForm

    def get_prepopulated_fields(self, request, obj=None):
        return {"slug": ("value",)}

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("filter_type")
            .prefetch_related(
                "translations",
                "filter_type__translations",
            )
        )

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        kwargs = formfield_for_filter_type_foreignkey(db_field, request, **kwargs)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


# ---- Filter Type -----------------------------------------------------------------------------------------------------
@admin.register(FilterType)
class FilterTypeAdmin(TranslatableAdmin):
    # list settings
    list_display = ("name",)
    search_fields = ("translations__name",)

    # object settings
    form = FilterTypeForm
    inlines = [FilterValueInline]

    def get_prepopulated_fields(self, request, obj=None):
        return {"slug": ("name",)}


# ---- Filter Group ----------------------------------------------------------------------------------------------------
@admin.register(FilterGroup)
class FilterGroupAdmin(TranslatableAdmin):
    # list settings
    list_display = ("name",)
    search_fields = ("translations__name",)

    # object settings
    form = FilterGroupForm
    filter_horizontal = ("filter_values",)

    def get_prepopulated_fields(self, request, obj=None):
        return {"slug": ("name",)}

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related("filter_type").prefetch_related("translations")

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        kwargs = formfield_for_filter_type_foreignkey(db_field, request, **kwargs)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        language_code = request.GET.get("language", request.LANGUAGE_CODE)
        filter_value_qs = (
            FilterValue.objects.language(language_code)
            .select_related("filter_type")
            .prefetch_related(
                "translations",
                "filter_type__translations",
            )
        )

        kwargs.update({"queryset": filter_value_qs}) if db_field.name == "filter_value" else None
        return super().formfield_for_manytomany(db_field, request, **kwargs)
