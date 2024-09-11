import random

from django.conf import settings
from django_filters import BooleanFilter, ChoiceFilter, NumberFilter
from django_filters.filterset import FilterSet

from .models import Category


class CategoryFilter(FilterSet):
    class Meta:
        model = Category
        fields = ["lang", "popular", "level"]

    TOP_N_ELEMENTS = 30
    PULL_OUT = 10

    lang = ChoiceFilter(field_name="translations__language_code", label="Language", choices=settings.LANGUAGES)
    popular = BooleanFilter(method="get_popular_categories", label="Return popular categories")
    level = NumberFilter(field_name="level", label="Tree Level")

    def get_popular_categories(self, queryset, _name, value):
        if value is False:
            return queryset

        ordered_qs = queryset.order_by("statistics__popularity_score")
        top_n_ids = list(ordered_qs.values_list("id", flat=True)[: self.TOP_N_ELEMENTS])

        ids = random.sample(top_n_ids, min(self.PULL_OUT, len(top_n_ids)))
        return ordered_qs.filter(id__in=ids)
