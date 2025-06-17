from typing import Any

from django.conf import settings
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from apps.product.models import Product, ProductImage, ProductProcessedImage
from apps.user.serializers import SellerProfileSerializer


class ProductImageProcessedSerializer(serializers.ModelSerializer[ProductProcessedImage]):
    class Meta:
        model = ProductProcessedImage
        fields = ["url", "height", "width"]

    url = serializers.URLField(source="image.url", default=settings.DEFAULT_IMAGE)


class ProductImageSerializer(serializers.ModelSerializer[ProductImage]):
    class Meta:
        model = ProductImage
        fields = ["id", "url", "processed_images"]

    url = serializers.URLField(source="image.url", default=settings.DEFAULT_IMAGE)
    processed_images = ProductImageProcessedSerializer(many=True, read_only=True)


class ProductListSerializer(serializers.ModelSerializer[Product]):
    class Meta:
        model = Product
        fields = ["id", "title", "image", "date_published", "price", "is_vip"]

    image = serializers.URLField(source="get_card_image_url")


class ProductPrivateListSerializer(ProductListSerializer):
    class Meta:
        model = Product
        fields = ProductListSerializer.Meta.fields + ["draft"]


class ProductDetailSerializer(serializers.ModelSerializer[Product]):
    class Meta:
        model = Product
        fields = ["id", "title", "description", "date_published", "quantity", "price", "images", "owner"]

    images = ProductImageSerializer(source="original_image", many=True, read_only=True)
    owner = SellerProfileSerializer(read_only=True)


class ProductPrivateDetailSerializer(ProductDetailSerializer):
    class Meta:
        model = Product
        fields = ProductDetailSerializer.Meta.fields + ["draft"]


class ProductCrateSerializer(serializers.ModelSerializer[Product]):
    class Meta:
        model = Product
        fields = ["category_id", "session_id", "title", "description", "price", "filters", "draft"]

    category_id = serializers.IntegerField(
        help_text=str(_("Category ID")),
        required=True,
        write_only=True,
    )
    session_id = serializers.UUIDField(
        help_text=str(_("Session ID")),
        required=True,
        write_only=True,
    )
    filters = serializers.CharField(
        help_text=str(_("Comma-separated list of integers (e.g., '1,2,3')")),
        required=False,
        allow_blank=False,
        write_only=True,
    )

    @staticmethod
    def validate_filters(value: str) -> list[int]:
        """Validate and converts a string value to a list of unique integers."""
        try:
            return list(set([int(i) for i in value.split(",")]))
        except ValueError:
            message = str(_("Filters must be a comma-separated list of integers."))
            raise serializers.ValidationError(message, code="invalid")


class ProductCreateResponseSerializer(serializers.Serializer[dict[str, Any]]):
    product_id = serializers.UUIDField(read_only=True)
    message = serializers.CharField(read_only=True)


class ProductUpdateSerializer(ProductCrateSerializer):
    pass
