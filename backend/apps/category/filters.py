from django.conf import settings
from django_filters import ChoiceFilter, NumberFilter
from django_filters.filterset import FilterSet

from .models import Category


class CategoryFilter(FilterSet):
    class Meta:
        model = Category
        fields = ["lang", "level"]

    lang = ChoiceFilter(field_name="translations__language_code", label="Language", choices=settings.LANGUAGES)
    level = NumberFilter(field_name="level", label="Tree Level")
