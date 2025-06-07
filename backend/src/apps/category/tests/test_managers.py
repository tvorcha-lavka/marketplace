from mptt.managers import TreeManager
from parler.managers import TranslatableManager

from apps.category.managers import CategoryManager, CategoryQuerySet


class TestCategoryManager:
    def test_as_manager_returns_category_manager(self) -> None:
        manager = CategoryQuerySet.as_manager()
        assert isinstance(manager, CategoryManager)

    def test_category_manager_inherits_correct_classes(self) -> None:
        assert issubclass(CategoryManager, TreeManager)
        assert issubclass(CategoryManager, TranslatableManager)

    def test_manager_uses_category_queryset(self) -> None:
        assert CategoryManager._queryset_class == CategoryQuerySet
