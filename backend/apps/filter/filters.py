from django.contrib import admin
from django.db.models import Count, Prefetch
from django.utils.translation import gettext_lazy as _
from django_filters import NumberFilter
from django_filters.filterset import FilterSet

from apps.category.models import Category

from .models import FilterType, FilterValue


class FilterTypeFilterAdmin(admin.SimpleListFilter):
    title = _("filter type")
    parameter_name = "filter_id"

    def lookups(self, request, model_admin):
        qs = FilterType.objects.filter(id=self.value()) if self.value() else FilterType.objects.all()
        queryset = qs.prefetch_related("translations")

        return [(obj.id, obj.name) for obj in queryset]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(id=self.value())
        return queryset


class FilterTypeFilter(FilterSet):
    class Meta:
        model = FilterType
        fields = ["category_id"]

    category_id = NumberFilter(required=True, method="filter_by_category_id")

    @staticmethod
    def filter_by_category_id(queryset, name, value):  # noqa: F841
        if not (category := Category.objects.filter(id=value).first()):
            return queryset.none()

        # Get ids for all parent categories
        parent_ids = list(category.get_ancestors(include_self=False).values_list("id", flat=True))

        # Get all filter types from parent and current category
        parent_filter_types_qs = FilterType.objects.filter(group__category_id__in=parent_ids)
        current_filter_types_qs = FilterType.objects.filter(group__category_id=value)

        # Find common filter types
        common_filter_types = parent_filter_types_qs & current_filter_types_qs

        # Get the values of all filter types from parent and current category
        parent_filter_values_qs = FilterValue.objects.filter(group__category_id__in=parent_ids)
        current_filter_values_qs = FilterValue.objects.filter(group__category_id=value)

        # Supplement ids of parent categories with the current value
        parent_ids.append(int(value))

        filter_value_qs = (
            # Replace parent filter types with filters for the current category
            (parent_filter_values_qs.exclude(filter_type__in=common_filter_types) | current_filter_values_qs)
            .prefetch_related("translations", "products")
            .annotate(product_count=Count("products"))
            .order_by("-product_count")
        )
        return (
            queryset.filter(group__category_id__in=parent_ids)
            .order_by("list_position")
            .prefetch_related(
                "translations",
                Prefetch(
                    lookup="filter_values",
                    queryset=filter_value_qs,
                    to_attr="filtered_values",
                ),
            )
            .distinct()
        )
