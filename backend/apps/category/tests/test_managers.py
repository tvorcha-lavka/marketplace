import pytest
from mptt.managers import TreeManager
from parler.managers import TranslatableManager

from apps.category.managers import CategoryManager, CategoryQuerySet


@pytest.mark.django_db
class TestCategoryManager:
    def test_as_manager_returns_category_manager(self):
        manager = CategoryQuerySet.as_manager()
        assert isinstance(manager, CategoryManager)

    def test_category_manager_inherits_correct_classes(self):
        assert issubclass(CategoryManager, TreeManager)
        assert issubclass(CategoryManager, TranslatableManager)

    def test_manager_uses_category_queryset(self):
        assert CategoryManager._queryset_class == CategoryQuerySet
