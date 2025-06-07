from io import BytesIO
from typing import Literal

from django.core.files.base import ContentFile
from django.core.files.uploadedfile import UploadedFile
from django.db.models.fields.files import FieldFile
from django.utils.text import slugify
from PIL import Image as PILImage
from PIL.Image import Image as PILImageType

__all__ = [
    "compress_image_to_jpeg",
    "admin_compress_image",
]


def compress_image_to_jpeg(image: UploadedFile | FieldFile, quality: int = 60) -> ContentFile[bytes]:
    """
    Compress an image and save it in JPEG format.

    :param image: The image to compress (Django image field or uploaded file).
    :param quality: The quality of the compressed image (1-100). The default is 60.
    """

    img: PILImageType = PILImage.open(image)
    output = BytesIO()

    # Remove all metadata by creating a new image without it
    img = img.copy()

    # Remove transparency if it exists
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    # Compressing and saving to JPEG
    img.save(output, format="JPEG", quality=quality)
    output.seek(0)

    # Return a JPEG image with a new extension
    name = image.name or "image"
    base_name = name.rsplit(".", 1)[0]
    new_filename = slugify(base_name) + ".jpg"

    return ContentFile(output.read(), new_filename)


def admin_compress_image(
    image: UploadedFile | FieldFile,
    output_format: Literal["JPEG", "PNG"],
    quality: int = 60,
) -> ContentFile[bytes]:
    """
    Compress an image and save it in JPEG or PNG format.
    """
    if output_format not in ["JPEG", "PNG"]:
        raise ValueError('Invalid output format: "%s". Acceptable formats are "JPEG" and "PNG".' % output_format)

    img = PILImage.open(image)

    # If the image is already a PNG, and we save it as a PNG, return it
    if img.format == "PNG" and output_format == "PNG":
        return image  # type: ignore[return-value]

    return compress_image_to_jpeg(image, quality)
