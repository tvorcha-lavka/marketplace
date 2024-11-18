from rest_framework import serializers

from .models import FilterType, FilterValue


class FilterValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilterValue
        fields = ["id", "value", "description", "metadata", "product_count"]

    product_count = serializers.IntegerField()


class FilterTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilterType
        fields = ["id", "required", "name", "values"]

    values = FilterValueSerializer(source="filtered_values", many=True)
