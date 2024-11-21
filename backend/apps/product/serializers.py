from rest_framework import serializers

from apps.product.models import Product, ProductImage
from apps.user.models import User


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "small", "medium", "large"]

    small = serializers.URLField(source="image_small.url", read_only=True)
    medium = serializers.URLField(source="image_medium.url", read_only=True)
    large = serializers.URLField(source="image_large.url", read_only=True)


class ProductReadOnlyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "date_published", "is_vip", "images", "price", "title"]

    images = ProductImageSerializer(many=True)


class ProductOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "date_joined", "last_active"]  # TODO: rating

    last_active = serializers.DateTimeField(source="last_login")


class ProductReadOnlyDetailSerializer(ProductReadOnlyListSerializer):
    class Meta:
        model = Product
        fields = ProductReadOnlyListSerializer.Meta.fields + ["description", "quantity", "owner"]

    owner = ProductOwnerSerializer()
