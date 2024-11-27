from rest_framework import serializers

from apps.product.models import Product, ProductImage
from apps.user.models import User


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "url", "priority")

    url = serializers.CharField(source="image.url", read_only=True)


class ProductReadOnlyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "date_published", "is_vip", "images", "price", "title"]

    images = ProductImageSerializer(many=True)


class ProductOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "date_joined", "last_active"]  # TODO: rating

    date_joined = serializers.DateTimeField(format="%d-%m-%Y")
    last_active = serializers.DateTimeField(source="last_login", format="%d-%m-%Y %H:%M")


class ProductReadOnlyDetailSerializer(ProductReadOnlyListSerializer):
    class Meta:
        model = Product
        fields = ProductReadOnlyListSerializer.Meta.fields + ["description", "owner", "quantity"]

    owner = ProductOwnerSerializer()
