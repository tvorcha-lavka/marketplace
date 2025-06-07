from typing import Any, TypeAlias, cast

from django.contrib.admin import StackedInline
from django.db.models import QuerySet
from django.forms import ModelChoiceField, ModelForm, Textarea, TextInput
from django.http import HttpRequest
from parler.admin import TranslatableTabularInline
from parler.forms import TranslatableModelForm
from parler.managers import TranslatableQuerySet

from apps.category.models import Category
from apps.filter.models import FilterGroup, FilterType, FilterValue

AnyModel: TypeAlias = Category | FilterType | FilterValue


class FilterValueForm(TranslatableModelForm[FilterValue]):  # type: ignore[misc]
    class Meta:
        model = FilterValue
        fields = ("filter_type", "value", "description", "metadata")
        widgets = {
            "value": TextInput(attrs={"style": "width: 95%;"}),
            "description": Textarea(attrs={"rows": 1, "style": "width: 95%;"}),
            "metadata": Textarea(attrs={"rows": 1, "style": "width: 80%;", "placeholder": '{"hex_code": #ffffff}'}),
        }


class FilterValueInline(TranslatableTabularInline[FilterValue, FilterType]):  # type: ignore[misc]
    model = FilterValue
    form = FilterValueForm
    extra = 0

    def get_queryset(self, request: HttpRequest) -> QuerySet[FilterValue]:
        qs: QuerySet[FilterValue] = (
            super()
            .get_queryset(request)
            .select_related("filter_type")
            .prefetch_related("translations", "filter_type__translations")
        )
        return qs


class FilterTypeForm(TranslatableModelForm[FilterType]):  # type: ignore[misc]
    class Meta:
        model = FilterType
        fields = ("name", "list_position", "required")


class FilterGroupForm(ModelForm[FilterGroup]):
    class Meta:
        model = FilterGroup
        fields = ("category", "filter_type", "filter_values")

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)

        for _field in self.fields:
            field = cast(ModelChoiceField[AnyModel], self.fields[_field])
            field_qs = cast(TranslatableQuerySet[AnyModel], field.queryset)
            field.queryset = field_qs.prefetch_related("translations")

        filter_values_field = cast(ModelChoiceField[FilterValue], self.fields["filter_values"])

        # fmt: off
        filter_values_field.queryset = (
            cast(TranslatableQuerySet[FilterValue], filter_values_field.queryset)
            .select_related("filter_type")
            .prefetch_related("filter_type__translations")
        )
        # fmt: on


class FilterGroupInline(StackedInline[FilterGroup, Category]):
    form = FilterGroupForm
    model = FilterGroup
    filter_horizontal = ("filter_values",)
    extra = 0
