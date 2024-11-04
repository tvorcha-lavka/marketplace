from rest_framework import serializers

from apps.filter.models import FilterValue
from apps.product.models import Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "url", "product", "priority")

    url = serializers.CharField(source="image.url", read_only=True)


class ProductFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilterValue
        fields = ["id", "value", "filter_type"]


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "seller",
            "category",
            "price",
            "date_published",
            "active",
            "is_vip",
            "quantity",
            "filters",
            "images",
        ]
        read_only_fields = ["id", "seller", "date_published", "created_at", "is_vip"]

    images = ProductImageSerializer(many=True, source="image")
    filters = ProductFilterSerializer(many=True)
