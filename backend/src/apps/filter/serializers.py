from rest_framework import serializers

from .models import FilterType, FilterValue


class FilterValueSerializer(serializers.ModelSerializer[FilterValue]):
    class Meta:
        model = FilterValue
        fields = ["id", "value", "description", "metadata", "product_count"]

    value = serializers.CharField()
    description = serializers.CharField()
    product_count = serializers.IntegerField()


class FilterTypeSerializer(serializers.ModelSerializer[FilterType]):
    class Meta:
        model = FilterType
        fields = ["id", "required", "name", "title", "values"]

    name = serializers.SlugField(source="slug", read_only=True)
    title = serializers.CharField(source="filter_name", read_only=True)
    values = FilterValueSerializer(source="filtered_values", many=True)
