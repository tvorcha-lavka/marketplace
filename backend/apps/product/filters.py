from django_filters import BaseInFilter, BooleanFilter, ChoiceFilter, NumberFilter
from django_filters.filterset import FilterSet

from .choices import ProductOrdering
from .models import Product


class ProductFilter(FilterSet):
    class Meta:
        model = Product
        fields = ["seller", "category", "filters_in", "vip_status", "order_by"]

    ORDERING_FIELDS = {
        ProductOrdering.CHEAP_TO_EXPENSIVE: "price",
        ProductOrdering.EXPENSIVE_TO_CHEAP: "-price",
        ProductOrdering.NEW_ITEMS: "-date_published",
        # TODO: ProductOrdering.SELLER_RATING: "-owner__rating",
    }

    seller = NumberFilter(field_name="owner", distinct=True)
    category = NumberFilter(field_name="category", distinct=True)
    vip_status = BooleanFilter(field_name="is_vip", distinct=True)
    filters_in = BaseInFilter(field_name="filters", distinct=True)
    order_by = ChoiceFilter(choices=ProductOrdering.choices, method="filter_order_by", label="Order by")

    def filter_order_by(self, queryset, name, value):  # noqa: F841
        return queryset.order_by(self.ORDERING_FIELDS.get(value))
