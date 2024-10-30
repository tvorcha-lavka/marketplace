from django import forms
from parler.forms import TranslatableModelForm

from apps.filter.models import FilterGroup, FilterGroupSet, FilterType, FilterValue


class FilterValueForm(TranslatableModelForm):
    class Meta:
        model = FilterValue
        fields = ("filter_type", "value", "metadata", "description", "slug")
        widgets = {
            "metadata": forms.Textarea(attrs={"rows": 1, "cols": 40, "placeholder": '{"hex_code": #ffffff}'}),
            "description": forms.Textarea(attrs={"rows": 1, "cols": 40}),
        }


class FilterTypeForm(TranslatableModelForm):
    class Meta:
        model = FilterType
        fields = ("name", "slug", "required")


class FilterGroupForm(TranslatableModelForm):
    class Meta:
        model = FilterGroup
        fields = ("name", "filter_type", "filter_values", "slug")


class FilterGroupSetForm(TranslatableModelForm):
    class Meta:
        model = FilterGroupSet
        fields = ("name", "groups", "slug")
