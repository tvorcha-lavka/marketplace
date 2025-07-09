from typing import Any

from pydantic import BaseModel

from apps.search.elastic.models import TranslatableText


class FiltersSchema(BaseModel):
    type_id: int
    type: str  # noqa: VNE003
    value_id: int
    value: TranslatableText

    @classmethod
    def get_filter_value_ids(cls, values: list[dict[str, Any]]) -> list[int]:
        """Get list of filter value ids."""
        return [cls(**data).value_id for data in values]
