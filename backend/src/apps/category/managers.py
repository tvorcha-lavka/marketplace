from typing import TYPE_CHECKING, Any, Self

from django.db.models import Manager, QuerySet
from mptt.managers import TreeManager
from mptt.querysets import TreeQuerySet
from parler.managers import TranslatableManager, TranslatableQuerySet

if TYPE_CHECKING:  # pragma: no cover
    from .models import Category  # noqa: F401


class CategoryQuerySet(TranslatableQuerySet, TreeQuerySet, QuerySet["Category"]):  # type: ignore[misc]

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self._prefetch_related_lookups = ()

    @classmethod
    def as_manager(cls) -> "CategoryManager":  # noqa: CCE001
        manager = CategoryManager.from_queryset(cls)()
        manager._built_with_as_manager = True
        return manager  # noqa

    as_manager.queryset_only = True  # type: ignore[attr-defined]

    def all(self) -> Self:
        return super().all()

    def filter(self, *args: Any, **kwargs: Any) -> Self:
        return super().filter(*args, **kwargs)

    def select_related(self, *fields: Any) -> Self:
        return super().select_related(*fields)

    def prefetch_related(self, *lookups: Any) -> Self:
        return super().prefetch_related(*lookups)

    def order_by(self, *field_names: Any) -> Self:
        return super().order_by(*field_names)


class CategoryManager(TreeManager, TranslatableManager, Manager["Category"]):  # type: ignore[misc]
    _queryset_class = CategoryQuerySet
