from django_filters import rest_framework as filters

from .models import Product


class ProductFilter(filters.FilterSet):
    class Meta:
        model = Product
        fields = ["seller", "category", "filters_in"]

    seller = filters.NumberFilter(method="get_product_from_filters")
    category = filters.NumberFilter(method="get_product_from_filters")
    filters_in = filters.BaseInFilter(method="get_product_from_filters")

    @staticmethod
    def get_product_from_filters(queryset, name, value):
        match name:
            case "seller":
                return queryset.filter(owner_id=value).distinct()
            case "category":
                return queryset.filter(category_id=value).distinct()
            case "filters_in":
                return queryset.filter(filters__id__in=value).distinct()
