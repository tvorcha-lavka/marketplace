from random import sample
from typing import TYPE_CHECKING, Iterable

from django.contrib.admin import ModelAdmin, SimpleListFilter
from django.db.models import QuerySet
from django.http import HttpRequest
from django.utils.translation import gettext_lazy as _
from django_filters import BooleanFilter, NumberFilter
from django_filters.filterset import FilterSet

from .choices import CardOrientation
from .managers import CategoryQuerySet
from .models import Category

if TYPE_CHECKING:  # pragma: no cover
    from django.utils.functional import _StrOrPromise


# --- Django Admin -----------------------------------------------------------------------------------------------------
class HasImageFilter(SimpleListFilter):
    title = _("image")
    parameter_name = "has_image"
    field_name = "image"

    def lookups(
        self,
        request: HttpRequest,
        model_admin: ModelAdmin[Category],
    ) -> Iterable[tuple[str, "_StrOrPromise"]] | None:

        return (
            ("yes", _("Exists")),
            ("no", _("Does not exist")),
        )

    def queryset(
        self,
        request: HttpRequest,
        queryset: QuerySet[Category],
    ) -> QuerySet[Category] | None:

        if (exist := self.value()) == "yes":
            return queryset.filter(image__isnull=False)
        elif exist == "no":
            return queryset.filter(image__isnull=True)

        return queryset


class ParentCategoryFilter(SimpleListFilter):
    title = _("Parent category")
    parameter_name = "parent_id"

    def lookups(
        self,
        request: HttpRequest,
        model_admin: ModelAdmin[Category],
    ) -> Iterable[tuple[str, "_StrOrPromise"]] | None:

        if parent_id := self.value():
            category = Category.objects.get(id=int(parent_id))
            children = category.get_children().filter(children__isnull=False).distinct()
            queryset = children if children else [category]

        else:
            queryset = Category.objects.filter(level=0).prefetch_related("translations")

        return [(str(category.pk), category.category_title) for category in queryset]

    def queryset(
        self,
        request: HttpRequest,
        queryset: QuerySet[Category],
    ) -> QuerySet[Category] | None:

        if parent_id := self.value():
            return queryset.filter(parent_id=int(parent_id))
        return queryset


# --- Swagger ----------------------------------------------------------------------------------------------------------
class CategoryFilter(FilterSet):
    class Meta:
        model = Category
        fields = ["popular", "level"]

    TOP_N_ELEMENTS = 30
    HORIZONTAL_COUNT = 4
    VERTICAL_COUNT = 1

    popular = BooleanFilter(method="get_popular_categories", label="Return popular categories")
    level = NumberFilter(field_name="level", label="Tree Level")

    def get_popular_categories(self, queryset: CategoryQuerySet, _name: str, value: bool) -> CategoryQuerySet:
        if value is False:
            return queryset

        def get_queryset(card_orientation: str, element_count: int) -> list[Category]:
            qs = queryset.filter(card__orientation=card_orientation)
            sorted_qs = qs.order_by("statistics__popularity_score")

            top_elements: list[Category] = list(sorted_qs[: self.TOP_N_ELEMENTS])
            return sample(top_elements, min(element_count, len(top_elements)))

        # Get popular categories with horizontal and vertical card orientation
        horizontal = get_queryset(CardOrientation.HORIZONTAL, self.HORIZONTAL_COUNT)
        vertical = get_queryset(CardOrientation.VERTICAL, self.VERTICAL_COUNT)

        # Combining horizontal & vertical into a final category queryset
        return queryset.filter(id__in=[category.id for category in horizontal + vertical])
