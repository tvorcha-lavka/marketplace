from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from apps.product.models import ProductImage


class ImageSchema(BaseModel):
    id: UUID  # noqa: VNE003
    hash: str  # noqa: VNE003

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def multi_model_serialize(cls, values: list[dict[str, Any]], product_id: UUID | str) -> list[dict[str, Any]]:
        """Serialize list of image data dicts with product_id."""
        return [cls(**data).model_serialize(product_id) for data in values]

    def model_serialize(self, product_id: UUID | str) -> dict[str, Any]:
        """Return serialized image with original and processed data."""
        orm = self.to_orm(product_id)
        return orm.original_image.model_dump() | {"processed": orm.processed_images_dump}

    def to_orm(self, product_id: UUID | str) -> ProductImage:
        """Convert schema to ProductImage instance."""
        return ProductImage(id=self.id, hash=self.hash, product_id=product_id)
