from pydantic import BaseModel

from apps.search.elastic.models import TranslatableText


class FiltersSchema(BaseModel):
    type_id: int
    type: str  # noqa: VNE003
    value_id: int
    value: TranslatableText
