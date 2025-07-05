from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OwnerSchema(BaseModel):
    id: UUID = Field(alias="user_id")  # noqa: VNE003
    public_username: str

    model_config = ConfigDict(
        validate_by_name=True,
        validate_by_alias=True,
        from_attributes=True,
    )
