import random

from django.conf import settings
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django_filters import BooleanFilter, ChoiceFilter, NumberFilter
from django_filters.filterset import FilterSet

from .models import CardOrientation, Category


# --- Django Admin -----------------------------------------------------------------------------------------------------
class HasImageFilter(admin.SimpleListFilter):
    title = _("image")
    parameter_name = "has_image"
    field_name = "image"

    def lookups(self, request, model_admin):
        return (
            ("yes", _("Exists")),
            ("no", _("Does not exist")),
        )

    def queryset(self, request, queryset):
        if self.value() == "yes":
            return queryset.filter(image__isnull=False)
        elif self.value() == "no":
            return queryset.filter(image__isnull=True)

        return queryset


class ParentCategoryFilter(admin.SimpleListFilter):
    title = _("Parent category")
    parameter_name = "parent_id"

    def lookups(self, request, model_admin):
        parent_id = self.value()

        if parent_id:
            category = Category.objects.get(id=parent_id)
            children = category.get_children().filter(children__isnull=False).distinct()
            queryset = children if children else [category]

        else:
            queryset = Category.objects.filter(level=0).prefetch_related("translations")

        return [(category.id, category.title) for category in queryset]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(parent_id=self.value())
        return queryset


# --- Swagger ----------------------------------------------------------------------------------------------------------
class CategoryFilter(FilterSet):
    class Meta:
        model = Category
        fields = ["lang", "popular", "level"]

    TOP_N_ELEMENTS = 30
    HORIZONTAL_COUNT = 4
    VERTICAL_COUNT = 1

    lang = ChoiceFilter(field_name="translations__language_code", label="Language", choices=settings.LANGUAGES)
    popular = BooleanFilter(method="get_popular_categories", label="Return popular categories")
    level = NumberFilter(field_name="level", label="Tree Level")

    def get_popular_categories(self, queryset, _name, value):
        if value is False:
            return queryset

        def get_queryset(card_orientation: str, element_count: int) -> list:
            qs = queryset.filter(card__orientation=card_orientation)
            sorted_qs = qs.order_by("statistics__popularity_score")

            top_elements = list(sorted_qs[: self.TOP_N_ELEMENTS])
            return random.sample(top_elements, min(element_count, len(top_elements)))

        # Get popular categories with horizontal and vertical card orientation
        horizontal_qs = get_queryset(CardOrientation.HORIZONTAL, self.HORIZONTAL_COUNT)
        vertical_qs = get_queryset(CardOrientation.VERTICAL, self.VERTICAL_COUNT)

        # Combining horizontal_qs & vertical_qs into a final category queryset
        return queryset.filter(id__in=[category.id for category in horizontal_qs + vertical_qs])
