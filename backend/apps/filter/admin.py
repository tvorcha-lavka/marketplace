from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html, format_html_join
from django.utils.translation import gettext_lazy as _
from parler.admin import TranslatableAdmin, TranslatableTabularInline

from .forms import FilterGroupForm, FilterGroupSetForm, FilterTypeForm, FilterValueForm
from .models import FilterGroup, FilterGroupSet, FilterType, FilterValue


class BaseFilterAdmin(TranslatableAdmin):
    @staticmethod
    def _display_field(*, obj, field: str, related_field: str, reverse_path: str):
        """
        Generates an HTML link to display the linked field.

        This method creates an HTML link to the linked object using the parameters.
        If the linked object is not found, returns a dash (`-`) character.

        Parameters:

        - obj: The object for which to display the linked field.

        - field: The name of the field used to retrieve the value from
          the linked object (for example, `name`).

        - related_field: The name of the related field in the current object
          from which the related object will be retrieved (e.g. `name`).

        - reverse_path: The path to the view in the admin to
          which the link will be referenced (e.g. `admin:filter_filtertype_change`).

        Returns:
        - str: An HTML link to the linked object, or a dash (`-`) if the linked object does not exist.
        """
        related_field_obj = getattr(obj, related_field)

        return (
            format_html(
                '<a href="{}">{}</a>',
                reverse(reverse_path, args=[related_field_obj.id]),
                related_field_obj.safe_translation_getter(field, default="-", language_code=obj.language_code),
            )
            if related_field_obj
            else "-"
        )

    @staticmethod
    def _display_list_field(*, obj, field: str, related_field: str, reverse_path: str):
        """
        Generates HTML links to display a list of related fields.

        This method generates HTML links to related objects as a list,
        using the specified parameters.
        If there are no related objects, return a dash (`-`) character.

        Parameters:

        - obj: The object for which to display the linked field.

        - field: The name of the field used to retrieve the value from
          the linked object (for example, `value`).

        - related_field: The name of the related field in the current object
          from which the related object will be retrieved (e.g. `value`).

        - reverse_path: The path to the view in the admin to
          which the link will be referenced (e.g. `admin:filter_filtervalue_change`).

        Returns:
        - str: HTML list of links to related objects, or a dash (`-`) if there are no related objects.
        """
        related_field_obj = getattr(obj, related_field)

        return (
            format_html_join(
                sep=", ",
                format_string='<a href="{}">{}</a>',
                args_generator=(
                    (
                        reverse(reverse_path, args=[i.id]),
                        i.safe_translation_getter(field, default="-", language_code=obj.language_code),
                    )
                    for i in related_field_obj.all()
                ),
            )
            if related_field_obj
            else "-"
        )

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        queryset_dict = {
            "filter_type": FilterType.objects.all(),
            "filter_values": FilterValue.objects.select_related("filter_type"),
            "groups": FilterGroup.objects.prefetch_related("filter_values", "filter_values__translations"),
        }

        if db_field.name in queryset_dict:
            qs = queryset_dict[db_field.name]
            language_code = request.GET.get("language", request.LANGUAGE_CODE)
            kwargs["queryset"] = qs.prefetch_related("translations").language(language_code)

        return super().formfield_for_dbfield(db_field, request, **kwargs)


# ---- Filter Value ----------------------------------------------------------------------------------------------------
class FilterValueInline(TranslatableTabularInline):
    model = FilterValue
    form = FilterValueForm
    extra = 0

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("filter_type")
            .prefetch_related("translations", "filter_type__translations")
        )

    def get_prepopulated_fields(self, request, obj=None):
        return {"slug": ("value",)}


@admin.register(FilterValue)
class FilterValueAdmin(BaseFilterAdmin):
    # list settings
    list_display = ("display_filter_type", "value", "all_languages_column")
    list_display_links = ("value",)
    list_filter = ("filter_type",)
    search_fields = ("filter_type__translations__name", "translations__value")

    # object settings
    form = FilterValueForm

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("filter_type")
            .prefetch_related("translations", "filter_type__translations")
            .order_by("filter_type")
            .distinct()
        )

    def get_prepopulated_fields(self, request, obj=None):
        return {"slug": ("value",)}

    @admin.display(description=_("Filter type"))
    def display_filter_type(self, obj):
        return self._display_field(
            obj=obj,
            field="name",
            related_field="filter_type",
            reverse_path="admin:filter_filtertype_change",
        )


# ---- Filter Type -----------------------------------------------------------------------------------------------------
@admin.register(FilterType)
class FilterTypeAdmin(BaseFilterAdmin):
    # list settings
    list_display = ("display_name", "display_filter_values", "all_languages_column")
    search_fields = ("translations__name",)

    # object settings
    form = FilterTypeForm
    inlines = [FilterValueInline]

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("values", "values__translations")

    def get_prepopulated_fields(self, request, obj=None):
        return {"slug": ("name",)}

    @admin.display(description=_("Filter type name"))
    def display_name(self, obj):
        return obj.name

    @admin.display(description=_("Filter values"))
    def display_filter_values(self, obj):
        return self._display_list_field(
            obj=obj,
            field="value",
            related_field="values",
            reverse_path="admin:filter_filtervalue_change",
        )


# ---- Filter Group ----------------------------------------------------------------------------------------------------
@admin.register(FilterGroup)
class FilterGroupAdmin(BaseFilterAdmin):
    # list settings
    list_display = ("display_name", "display_filter_type", "display_filter_values", "all_languages_column")
    list_filter = ("filter_type",)
    search_fields = ("translations__name",)

    # object settings
    form = FilterGroupForm
    filter_horizontal = ("filter_values",)

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("filter_type")
            .prefetch_related("filter_type__translations", "filter_values__translations")
        )

    def get_prepopulated_fields(self, request, obj=None):
        return {"slug": ("name",)}

    @admin.display(description=_("Group name"))
    def display_name(self, obj):
        return obj.name

    @admin.display(description=_("Filter type"))
    def display_filter_type(self, obj):
        return self._display_field(
            obj=obj,
            field="name",
            related_field="filter_type",
            reverse_path="admin:filter_filtertype_change",
        )

    @admin.display(description=_("Filter values"))
    def display_filter_values(self, obj):
        return self._display_list_field(
            obj=obj,
            field="value",
            related_field="filter_values",
            reverse_path="admin:filter_filtervalue_change",
        )


# ---- Filter Group Set ------------------------------------------------------------------------------------------------
@admin.register(FilterGroupSet)
class FilterGroupSetAdmin(BaseFilterAdmin):
    # list settings
    list_display = ("display_name", "display_filter_groups", "all_languages_column")
    search_fields = ("translations__name",)

    # object settings
    form = FilterGroupSetForm
    filter_horizontal = ("groups",)

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("groups__translations")

    def get_prepopulated_fields(self, request, obj=None):
        return {"slug": ("name",)}

    @admin.display(description=_("Group set"))
    def display_name(self, obj):
        return obj.name

    @admin.display(description=_("Groups"))
    def display_filter_groups(self, obj):
        return self._display_list_field(
            obj=obj,
            field="name",
            related_field="groups",
            reverse_path="admin:filter_filtergroup_change",
        )
