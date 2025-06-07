from typing import Any, TypeVar

from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.db.models import Field, Manager, Model, QuerySet
from django.forms.fields import Field as FormField
from django.http import HttpRequest
from django.urls import reverse
from django.utils.html import format_html_join
from django.utils.translation import gettext_lazy as _
from parler.admin import TranslatableAdmin

from apps.category.models import Category

from .filters import FilterTypeFilterAdmin
from .forms import FilterGroupForm, FilterTypeForm, FilterValueForm, FilterValueInline
from .models import FilterGroup, FilterType, FilterValue

_ModelT = TypeVar("_ModelT", bound=Model)
_ManagerT = TypeVar("_ManagerT", bound=Manager[Any])


class BaseFilterAdmin(ModelAdmin[_ModelT]):
    @staticmethod
    def _display_field(*, obj: _ModelT, field: str, reverse_path: str) -> str:
        """
        Generates an HTML link to display the linked field.

        This method creates an HTML link to the linked object using the parameters.
        If the linked object is not found, returns a dash (`-`) character.

        Parameters:
            obj: The object for which to display the linked field.

            field: The name of the field used to retrieve the value from
            the linked object (for example, `name`).

            reverse_path: The path to the view in the admin to
            which the link will be referenced (e.g. `admin:filter_filtertype_change`).

        Returns:
            str: An HTML link to the linked object, or a dash (`-`) if the linked object does not exist.
        """
        args = (reverse(reverse_path, args=[obj.pk]), getattr(obj, field)) if obj else ()
        return format_html_join(", ", '<a href="{}">{}</a>', (args,)) if obj else "-"

    @staticmethod
    def _display_related_fields(*, rel_obj_manager: _ManagerT, field: str, reverse_path: str) -> str:
        """
        Generates HTML links to display a list of related fields.

        This method generates HTML links to related objects as a list,
        using the specified parameters.
        If there are no related objects, return a dash (`-`) character.

        Parameters:
            rel_obj_manager: The manager for the related objects.

            field: The name of the field used to retrieve the value from
            the linked object (for example, `value`).

            reverse_path: The path to the view in the admin to
            which the link will be referenced (e.g. `admin:filter_filtervalue_change`).

        Returns:
            str: HTML list of links to related objects or a dash (`-`) if there are no related objects.
        """
        queryset = rel_obj_manager.all()
        args = ((reverse(reverse_path, args=[obj.pk]), getattr(obj, field)) for obj in queryset)
        return format_html_join(", ", '<a href="{}">{}</a>', args) if queryset else "-"

    def formfield_for_dbfield(
        self,
        db_field: Field[Any, Any],
        request: HttpRequest,
        **kwargs: Any,
    ) -> FormField | None:
        queryset_dict = {
            "category": Category.objects.all(),
            "filter_type": FilterType.objects.all(),
            "filter_values": FilterValue.objects.select_related("filter_type"),
        }

        if db_field.name in queryset_dict:
            qs = queryset_dict[db_field.name]
            kwargs["queryset"] = qs.prefetch_related("translations")

        return super().formfield_for_dbfield(db_field, request, **kwargs)


# ---- Filter Value ----------------------------------------------------------------------------------------------------
@admin.register(FilterValue)
class FilterValueAdmin(TranslatableAdmin[FilterValue], BaseFilterAdmin[FilterValue]):  # type: ignore[misc]
    # list settings
    list_display = ("display_filter_type", "value", "description", "all_languages_column")  # noqa
    list_display_links = ("value",)
    list_filter = (FilterTypeFilterAdmin,)
    search_fields = ("filter_type__translations__name", "translations__value")  # noqa

    # object settings
    form = FilterValueForm

    def get_queryset(self, request: HttpRequest) -> QuerySet[FilterValue]:
        qs: QuerySet[FilterValue] = (
            super()
            .get_queryset(request)
            .select_related("filter_type")
            .prefetch_related("translations", "filter_type__translations")
            .order_by("filter_type")
            .distinct()
        )
        return qs

    @admin.display(description=_("Filter type"))
    def display_filter_type(self, obj: FilterValue) -> str:
        return self._display_field(
            field="name",
            obj=obj.filter_type,
            reverse_path="admin:filter_filtertype_change",
        )


# ---- Filter Type -----------------------------------------------------------------------------------------------------
@admin.register(FilterType)
class FilterTypeAdmin(TranslatableAdmin[FilterType], BaseFilterAdmin[FilterType]):  # type: ignore[misc]
    # list settings
    list_display = ("display_name", "display_filter_values", "list_position", "all_languages_column")
    search_fields = ("translations__name",)  # noqa

    # object settings
    form = FilterTypeForm
    inlines = (FilterValueInline,)

    def get_queryset(self, request: HttpRequest) -> QuerySet[FilterType]:
        qs: QuerySet[FilterType] = (
            super()
            .get_queryset(request)
            .prefetch_related(
                "filter_values",
                "filter_values__translations",
            )
        )
        return qs

    @admin.display(description=_("Filter type name"))
    def display_name(self, obj: FilterType) -> str:
        return obj.filter_name

    @admin.display(description=_("Filter values"))
    def display_filter_values(self, obj: FilterGroup) -> str:
        return self._display_related_fields(
            field="value",
            rel_obj_manager=obj.filter_values,
            reverse_path="admin:filter_filtervalue_change",
        )


# ---- Filter Group ----------------------------------------------------------------------------------------------------
@admin.register(FilterGroup)
class FilterGroupAdmin(BaseFilterAdmin[FilterGroup]):
    # list settings
    list_display = ("category", "display_filter_type", "display_filter_values")
    search_fields = ("category__translations__name", "filter_type__translations__name")  # noqa
    list_filter = (FilterTypeFilterAdmin,)

    # object settings
    form = FilterGroupForm
    filter_horizontal = ("filter_values",)

    def get_queryset(self, request: HttpRequest) -> QuerySet[FilterGroup]:
        qs = super().get_queryset(request)

        if request.path.endswith("/filtergroup/"):
            return qs.prefetch_related(
                "category__translations",
                "filter_type__translations",
                "filter_values__translations",
            )

        return qs.select_related("category", "filter_type")

    @admin.display(description=_("Filter type"))
    def display_filter_type(self, obj: FilterGroup) -> str:
        return self._display_field(
            field="name",
            obj=obj.filter_type,
            reverse_path="admin:filter_filtertype_change",
        )

    @admin.display(description=_("Filter values"))
    def display_filter_values(self, obj: FilterGroup) -> str:
        return self._display_related_fields(
            field="value",
            rel_obj_manager=obj.filter_values,
            reverse_path="admin:filter_filtervalue_change",
        )
