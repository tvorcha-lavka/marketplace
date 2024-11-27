from io import BytesIO
from typing import Literal

from django.core.files.base import ContentFile
from PIL import Image, ImageOps


def compress_image_to_jpeg(image: Image, quality: int = 60) -> ContentFile:
    """
    Compress an image and save it in the specified format.

    :param image: The image to compress (django image field).
    :param quality: The quality of the compressed image (1-100). The default compression level is 60%.

    :raises ValueError: If output_format is not one of the accepted formats.
    """

    # Open the image
    img = Image.open(image)
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
    base_name = image.name.rsplit(".", 1)[0]
    new_filename = base_name + ".jpg"

    return ContentFile(output.read(), new_filename)


def user_compress_image(image: Image):
    return compress_image_to_jpeg(image)


def admin_compress_image(image: Image, output_format: Literal["JPEG", "PNG"], quality: int = 60):
    if output_format not in ["JPEG", "PNG"]:
        raise ValueError('Invalid output format: "%s". Acceptable formats are "JPEG" and "PNG".' % output_format)

    img = Image.open(image)

    # If the image is already a PNG, and we save it as a PNG, return it
    if img.format == "PNG" and output_format == "PNG":
        return image

    return compress_image_to_jpeg(image, quality)


def resize_image(image: bytes, image_name: str, max_width: int, max_height: int) -> ContentFile:
    # Open the image
    img = Image.open(BytesIO(image))
    output = BytesIO()

    # Apply EXIF orientation if it exists
    img = ImageOps.exif_transpose(img)

    # Remove all metadata by creating a new image without it
    img = img.copy()

    # Remove transparency if it exists
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    # Resizing
    img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)

    # Save the result to memory
    img.save(output, format="JPEG", quality=90)
    output.seek(0)

    # Create a new file name
    base_name = image_name.rsplit(".", 1)[0]
    new_filename = base_name + ".jpg"

    return ContentFile(output.read(), new_filename)
