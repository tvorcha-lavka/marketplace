from typing import Iterable, Self, TypeAlias, TypeVar

from django.conf import settings
from parler.models import TranslatableModel
from pydantic import BaseModel, create_model

_TranslatableModel = TypeVar("_TranslatableModel", bound=TranslatableModel)


__all__ = [
    "TranslatableText",
    "TranslatableTextList",
]


class TranslatableMixin(BaseModel):

    @classmethod
    def from_model(cls, model: _TranslatableModel, field: str) -> Self:
        """Creates an object from a single model (str per language)."""

        def get(lang: str) -> str | None:
            return model.safe_translation_getter(field, language_code=lang) if model else None

        return cls(**{lang: get(lang) for lang in cls.model_fields})  # noqa

    @classmethod
    def from_models(cls, models: Iterable[_TranslatableModel], field: str) -> Self:
        """Creates an object from a list of models (list[str] per language)."""

        def get_list(lang: str) -> list[str] | None:
            values = [m.safe_translation_getter(field, language_code=lang) for m in models]
            values = [v for v in values if v]
            return values or None

        return cls(**{lang: get_list(lang) for lang in cls.model_fields})  # noqa


def create_translatable_model(name: str, base_type: type) -> type[TranslatableMixin]:
    fields = {lang: (base_type | None, ...) for lang, _ in settings.LANGUAGES}
    return create_model(name, __base__=TranslatableMixin, **fields)  # type: ignore


TranslatableText: TypeAlias = create_translatable_model("TranslatableText", str)  # type: ignore
TranslatableTextList: TypeAlias = create_translatable_model("TranslatableTextList", list[str])  # type: ignore
