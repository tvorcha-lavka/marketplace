from django.db.models import Count
from django_filters import BaseInFilter, BooleanFilter, ChoiceFilter, NumberFilter
from django_filters.filterset import FilterSet

from .choices import ProductOrdering
from .models import Product


class ProductPublicFilter(FilterSet):
    class Meta:
        model = Product
        fields = ["seller", "category", "filters_in", "vip_status", "order_by"]

    ORDERING_FIELDS = {
        ProductOrdering.CHEAP_TO_EXPENSIVE: "price",
        ProductOrdering.EXPENSIVE_TO_CHEAP: "-price",
        ProductOrdering.NEW_ITEMS: "-date_published",
        ProductOrdering.SELLER_RATING: "-seller_rating",
    }

    seller = NumberFilter(field_name="owner", distinct=True)
    category = NumberFilter(field_name="category", distinct=True)
    vip_status = BooleanFilter(field_name="is_vip", distinct=True)
    filters_in = BaseInFilter(field_name="filters", method="contains_all_filters")
    order_by = ChoiceFilter(choices=ProductOrdering.choices, method="filter_order_by", label="Order by")

    @staticmethod
    def contains_all_filters(queryset, name, value):  # noqa: F841
        """Filters products that contain all the specified filters."""
        return (
            queryset.filter(filters__id__in=value)
            .annotate(matching_filters=Count("filters__id", distinct=True))
            .filter(matching_filters=len(value))
        )

    def filter_order_by(self, queryset, name, value):  # noqa: F841
        return queryset.order_by(self.ORDERING_FIELDS.get(value))


class ProductPrivateFilter(FilterSet):
    class Meta:
        model = Product
        fields = ["active", "draft", "vip_status"]

    active = BooleanFilter(field_name="active", distinct=True)
    draft = BooleanFilter(field_name="draft", distinct=True)
    vip_status = BooleanFilter(field_name="is_vip", distinct=True)
