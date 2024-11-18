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


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price", "date_published", "is_vip"]


class ProductDetailSerializer(ProductListSerializer):
    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + [
            "description",
            "owner",
            "category",
            "quantity",
            "filters",
            "images",
        ]

    images = ProductImageSerializer(many=True, source="image")
    filters = ProductFilterSerializer(many=True)
