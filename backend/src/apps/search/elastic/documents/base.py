from typing import Any, ClassVar, Generic, Iterator, Self, TypeVar
from uuid import UUID

from django.db.models import Model
from django.utils.translation import get_language
from elasticsearch.helpers import bulk
from pydantic import BaseModel, ConfigDict

from apps.search.elastic.models import TranslatableText, TranslatableTextList
from core.elasticsearch.client import elastic

_Model = TypeVar("_Model", bound=Model)


class BaseDocument(BaseModel, Generic[_Model]):
    id: UUID | int  # noqa: VNE003

    index_name: ClassVar[str]
    index_settings: ClassVar[dict[str, Any]]
    model: ClassVar[type[_Model]]  # type: ignore[misc]  # noqa

    model_config = ConfigDict(from_attributes=True)

    @property
    def as_bulk_action(self) -> dict[str, Any]:
        """Return single action for elasticsearch.helpers.bulk()."""
        return {
            "_op_type": "index",
            "_index": self.index_name,
            "_id": str(self.id),
            **self.model_dump(exclude={"id"}),
        }

    @classmethod
    def __pydantic_init_subclass__(cls, **kwargs: Any) -> None:
        """Validate document subclass after initialization."""

        # Skip base generic class like BaseDocument[_Model]
        if cls.__pydantic_core_schema__.get("generic_origin"):
            return

        required_attrs = ["index_name", "index_settings", "model"]

        if missing := [attr for attr in required_attrs if not hasattr(cls, attr)]:
            raise AttributeError(f"{cls.__name__} is missing required attributes: {missing}")  # noqa

    @classmethod
    def from_orm(cls, model: _Model) -> Self:
        """Convert Django model to Document."""
        return cls.model_validate(model)

    @classmethod
    def get_iterator(cls) -> Iterator[_Model]:
        """Return queryset iterator for current model."""
        return cls.model.objects.iterator(chunk_size=2000)  # type: ignore[no-any-return]

    @classmethod
    def _get_bulk_actions(cls) -> list[dict[str, Any]]:
        """Get list of bulk actions for elasticsearch index."""
        return cls._bulk_from_queryset_iterator(cls.get_iterator())

    @classmethod
    def _bulk_from_queryset_iterator(cls, iterator: Iterator[_Model]) -> list[dict[str, Any]]:
        """Convert queryset iterator to list of bulk actions for elasticsearch index."""
        return [cls.from_orm(model).as_bulk_action for model in iterator]

    @classmethod
    def _index_create(cls, force_recreate: bool = False) -> None:
        """Create elasticsearch index or replace if exists."""
        if elastic.indices.exists(index=cls.index_name):
            if not force_recreate:
                return

            elastic.indices.delete(index=cls.index_name)

        elastic.indices.create(
            index=cls.index_name,
            body=cls.index_settings,
        )

    @classmethod
    def index(cls, model: _Model) -> None:
        """Create or replace document in elasticsearch."""
        doc = cls.from_orm(model)
        elastic.index(
            index=cls.index_name,
            id=str(doc.id),
            document=doc.model_dump(exclude={"id"}),
            refresh="wait_for",
        )

    @classmethod
    def index_all(cls, force_recreate: bool = False) -> None:
        """Index all documents in elasticsearch."""
        cls._index_create(force_recreate=force_recreate)
        bulk(client=elastic, actions=cls._get_bulk_actions(), refresh="wait_for")

    @classmethod
    def index_update(cls, model: _Model, fields: set[str]) -> None:
        """Update document in elasticsearch."""
        doc = cls.from_orm(model)
        elastic.update(
            index=cls.index_name,
            id=str(doc.id),
            body={"doc": doc.model_dump(include=fields)},
            doc_as_upsert=True,
            refresh="wait_for",
        )

    @classmethod
    def index_delete(cls, index_id: UUID | str | int) -> None:
        """Delete document from elasticsearch."""
        elastic.delete(
            index=cls.index_name,
            id=str(index_id),
            refresh="wait_for",
        )

    @classmethod
    def serialize_from_hits(cls, hits: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Convert elasticsearch hits to list of serialized documents."""

        def normalize(hit: dict[str, Any]) -> "BaseDocument[_Model]":
            source = hit["_source"].copy()
            source["id"] = hit["_id"]
            return cls.model_validate(source)

        return [normalize(hit).model_serialize() for hit in hits]

    def model_serialize(self, *args: Any, **kwargs: Any) -> dict[str, Any]:
        """Convert Document to dict for serialization."""
        data = super().model_dump(*args, **kwargs)
        lang_code = get_language()

        for key, value in data.items():
            field = self.model_fields[key]

            if field.annotation in [TranslatableText, TranslatableTextList]:
                data[key] = value[lang_code]

        return data
