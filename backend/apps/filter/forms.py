from django import forms
from django.contrib import admin
from django.forms import ModelForm
from parler.admin import TranslatableTabularInline
from parler.forms import TranslatableModelForm

from apps.filter.models import FilterGroup, FilterType, FilterValue


class FilterValueForm(TranslatableModelForm):
    class Meta:
        model = FilterValue
        fields = ("filter_type", "value", "description", "metadata")
        widgets = {
            "value": forms.TextInput(attrs={"style": "width: 95%;"}),
            "description": forms.Textarea(attrs={"rows": 1, "style": "width: 95%;"}),
            "metadata": forms.Textarea(
                attrs={"rows": 1, "style": "width: 80%;", "placeholder": '{"hex_code": #ffffff}'}
            ),
        }


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


class FilterTypeForm(TranslatableModelForm):
    class Meta:
        model = FilterType
        fields = ("name", "list_position", "required")


class FilterGroupForm(ModelForm):
    class Meta:
        model = FilterGroup
        fields = ("category", "filter_type", "filter_values")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self._meta.formfield_callback.keywords.get("request")  # type: ignore
        lang = request.GET.get("language", request.LANGUAGE_CODE)

        for field in self.fields:
            field_qs = self.fields[field].queryset
            self.fields[field].queryset = field_qs.language(lang).prefetch_related("translations")

        filter_values_qs = self.fields["filter_values"].queryset
        self.fields["filter_values"].queryset = filter_values_qs.select_related("filter_type").prefetch_related(
            "filter_type__translations"
        )


class FilterGroupInline(admin.StackedInline):
    form = FilterGroupForm
    model = FilterGroup
    filter_horizontal = ("filter_values",)
    extra = 0
