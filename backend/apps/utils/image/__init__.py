from django.conf import settings

from .utils import admin_compress_image  # noqa: F401

AWS_S3_DOMAIN = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}"
DEFAULT_IMAGE = f"{AWS_S3_DOMAIN}/defaults/no-image.jpg"
