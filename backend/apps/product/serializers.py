import hashlib

from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from apps.product.models import Product, ProductImage
from apps.user.serializers import PublicProfileSerializer
from apps.utils.image import DEFAULT_IMAGE


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["s_image_url", "m_image_url", "l_image_url"]

    s_image_url = serializers.URLField(source="image_small.url", default=DEFAULT_IMAGE)
    m_image_url = serializers.URLField(source="image_medium.url", default=DEFAULT_IMAGE)
    l_image_url = serializers.URLField(source="image_large.url", default=DEFAULT_IMAGE)


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "title", "s_image_url", "date_published", "price", "is_vip"]

    s_image_url = serializers.URLField(source="images.first.image_small.url", default=DEFAULT_IMAGE)


class ProductPrivateListSerializer(ProductListSerializer):
    class Meta:
        model = Product
        fields = ProductListSerializer.Meta.fields + ["draft"]


class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "title", "description", "date_published", "price", "images", "owner"]

    images = ProductImageSerializer(many=True, read_only=True)
    owner = PublicProfileSerializer(read_only=True)


class ProductPrivateDetailSerializer(ProductDetailSerializer):
    class Meta:
        model = Product
        fields = ProductDetailSerializer.Meta.fields + ["draft"]


class ProductEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["category_id", "title", "description", "price", "images", "filters", "draft"]

    category_id = serializers.IntegerField(help_text=_("Category ID"))
    filters = serializers.CharField(
        help_text=_("Comma-separated list of integers (e.g., '1,2,3')"),
        required=False,
        allow_null=False,
        allow_blank=False,
        write_only=True,
    )
    images = serializers.ListField(
        help_text=_("Max. number of images = 10"),
        child=serializers.ImageField(),
        max_length=10,
        required=False,
        allow_null=False,
        write_only=True,
    )

    @staticmethod
    def validate_filters(value: str):
        """Validate and converts a string value to a list of unique integers."""
        try:
            return set([int(i) for i in value.split(",")])
        except ValueError:
            message = _("Filters must be a comma-separated list of integers.")
            raise serializers.ValidationError(message, code="invalid")

    @staticmethod
    def validate_images(images: list):
        """Check uniqueness of images through hashing."""
        unique_hashes, unique_images = set(), []

        for image in images:
            file_hash = hashlib.md5(b"".join(image.chunks())).hexdigest()

            if file_hash not in unique_hashes:
                unique_hashes.add(file_hash)
                unique_images.append(image)

        return unique_images
