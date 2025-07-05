from uuid import UUID

from pydantic import BaseModel

from .images import ImagePreset


class OptimizeProductImages(BaseModel):
    """
    Data Transfer Object
    for optimizing product images task.
    """

    user_id: UUID
    session_id: UUID
    product_id: UUID
    preset: ImagePreset
