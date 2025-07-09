from enum import Enum
from functools import lru_cache
from pathlib import PurePosixPath
from typing import NamedTuple
from uuid import UUID

from django.conf import settings
from pydantic import BaseModel


class OriginalImage(BaseModel):
    id: UUID  # noqa: VNE003
    url: str


class ProcessedImage(BaseModel):
    url: str
    width: int
    height: int


class ImageBundle(OriginalImage):
    processed: list[ProcessedImage]


class ImageConfig(BaseModel):
    format: str  # noqa: VNE003
    height: int
    width: int
    quality: int
    template: str = ""


class PresetType(BaseModel):
    original: ImageConfig
    processed: list[ImageConfig]


class ImagePreset(BaseModel):
    aws_s3_folder: PurePosixPath
    type: PresetType  # noqa: VNE003


class ProcessedImageBundle(NamedTuple):
    THUMBNAIL: ProcessedImage
    MEDIUM: ProcessedImage
    LARGE: ProcessedImage


class ImagePresetEnum(Enum):

    ORIGINAL = ImageConfig(width=0, height=0, quality=80, format="JPEG")
    THUMBNAIL = ImageConfig(width=150, height=200, quality=90, format="WEBP")
    MEDIUM = ImageConfig(width=450, height=600, quality=90, format="WEBP")
    LARGE = ImageConfig(width=675, height=900, quality=90, format="WEBP")

    def __init__(self, _value: ImageConfig) -> None:
        self.value.template = self.template

    @property
    def width(self) -> int:
        return int(self.value.width)

    @property
    def height(self) -> int:
        return int(self.value.height)

    @property
    def template(self) -> str:
        if self.name == "ORIGINAL":
            return "original_{hash}.jpg"
        return f"{self.width}x{self.height}_{{hash}}.webp"

    @property
    def aws_s3_folder(self) -> PurePosixPath:
        dev_folder = "dev/" if settings.ENVIRONMENT == "development" else ""
        return PurePosixPath(dev_folder) / "product" / "{product_id}"

    @property
    def url_template(self) -> str:
        return f"{settings.AWS_S3_DOMAIN}/" + str(self.aws_s3_folder / self.template)

    @classmethod
    @lru_cache(maxsize=1)
    def to_pydantic(cls) -> ImagePreset:
        return ImagePreset(
            aws_s3_folder=cls.ORIGINAL.aws_s3_folder,
            type=PresetType(
                original=cls.ORIGINAL.value,
                processed=[m.value for m in cls if m.name != cls.ORIGINAL.name],
            ),
        )
