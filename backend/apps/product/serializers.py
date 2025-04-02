import hashlib
from typing import Optional

from django.core.files.uploadedfile import TemporaryUploadedFile
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from apps.product.models import Product, ProductImage, ProductProcessedImage
from apps.user.serializers import SellerProfileSerializer
from apps.utils.image import DEFAULT_IMAGE


class ProductImageProcessedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductProcessedImage
        fields = ["url", "height", "width"]

    url = serializers.URLField(source="image.url", default=DEFAULT_IMAGE)


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "url", "processed_images"]

    url = serializers.URLField(source="image.url", default=DEFAULT_IMAGE)
    processed_images = ProductImageProcessedSerializer(many=True, read_only=True)


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "title", "image", "date_published", "price", "is_vip"]

    image = serializers.URLField(source="get_card_image_url")


class ProductPrivateListSerializer(ProductListSerializer):
    class Meta:
        model = Product
        fields = ProductListSerializer.Meta.fields + ["draft"]


class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "title", "description", "date_published", "quantity", "price", "images", "owner"]

    images = ProductImageSerializer(source="original_image", many=True, read_only=True)
    owner = SellerProfileSerializer(read_only=True)


class ProductPrivateDetailSerializer(ProductDetailSerializer):
    class Meta:
        model = Product
        fields = ProductDetailSerializer.Meta.fields + ["draft"]


class ProductCrateSerializer(serializers.ModelSerializer):
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
    def validate_filters(value: str) -> set[int]:
        """Validate and converts a string value to a list of unique integers."""
        try:
            return set([int(i) for i in value.split(",")])
        except ValueError:
            message = _("Filters must be a comma-separated list of integers.")
            raise serializers.ValidationError(message, code="invalid")

    @staticmethod
    def validate_images(images: list[TemporaryUploadedFile]) -> list[TemporaryUploadedFile]:
        """Check the uniqueness of images through hashing."""
        unique_hashes, unique_images = set(), []

        # Get hashes of uploaded images
        for image in images:
            file_hash = hashlib.md5(b"".join(image.chunks())).hexdigest()
            image.seek(0)

            # Add image if file hash is unique
            if file_hash not in unique_hashes:
                image._file_hash = file_hash
                unique_hashes.add(file_hash)
                unique_images.append(image)

        return unique_images


class ProductUpdateSerializer(ProductCrateSerializer):
    def validate_images(
        self, images: list[TemporaryUploadedFile]
    ) -> list[tuple[str, Optional[ProductImage], int, Optional[TemporaryUploadedFile]]]:
        """
        Validates the provided images by ensuring uniqueness and determining
        the actions needed for each image - create, update, or delete.

        Args:
            images (list[TemporaryUploadedFile]): List of uploaded image files.

        Returns:
            list[tuple]: A list of tuples:
                - action type,
                - existing ProductImage object,
                - image index,
                - temporary file.
        """
        # First validate uniqueness using parent method
        unique_images = super().validate_images(images)
        instance_images = {}
        result = []

        # Get hashes of existing instance images
        for obj in self.instance.images.all():
            file_hash = hashlib.md5(b"".join(obj.image_small.chunks())).hexdigest()
            instance_images[file_hash] = obj

        # Prepare data for each image
        for index, temp_file in enumerate(unique_images, start=1):
            file_hash = temp_file._file_hash  # noqa

            # Preparing data for creation
            if file_hash not in instance_images:
                result.append(("create", None, index, temp_file))

            # Preparing data for updating
            elif file_hash in instance_images:
                obj = instance_images.pop(file_hash)
                result.append(("update", obj, index, None))

        # Preparing data for deletion (remaining in instance_images)
        result.extend([("delete", obj, 0, None) for obj in instance_images.values()])
        return result
