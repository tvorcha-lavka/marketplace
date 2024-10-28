"""
from django.core.validators import FileExtensionValidator


class MyModel(models.Model):
    class Meta:
        abstract = True

    image = models.ImageField(
        upload_to="images/",
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"]),
            validate_image_size,
            validate_image_resolution
        ]
    )
"""

from django.utils.translation import gettext_lazy as _
from PIL import Image
from rest_framework.exceptions import ValidationError


def validate_image_size(image):
    max_size_mb = 5
    max_size_kb = 1024 * max_size_mb

    if image.size > max_size_kb * 1024:
        raise ValidationError(_("Image file too large (max: %s Mb)" % max_size_mb))


def validate_image_resolution(image):
    max_width, max_height = 3024, 4032

    img = Image.open(image)
    width, height = img.size
    if width > max_width or height > max_height:
        raise ValidationError(_("Image resolution is too high (max: %sx%s)" % (max_width, max_height)))
