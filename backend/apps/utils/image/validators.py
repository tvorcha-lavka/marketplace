"""
from django.core.validators import FileExtensionValidator


class MyModel(models.Model):
    class Meta:
        abstract = True

    image = models.ImageField(
        upload_to="images/",
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"]),
            validate_image_size
        ]
    )
"""

from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.utils.translation import gettext_lazy as _

ALLOWED_IMAGE_EXTENSIONS = ("jpg", "jpeg", "png", "heic", "heif")
validate_image_extension = FileExtensionValidator(allowed_extensions=ALLOWED_IMAGE_EXTENSIONS)


def validate_image_size(image):
    max_size_mb = 5
    max_size_kb = 1024 * max_size_mb

    if image.size > max_size_kb * 1024:
        raise ValidationError(_("Image file too large (max: %s Mb)" % max_size_mb))


image_validators = [validate_image_extension, validate_image_size]
