from apps.category.models import Category, CategoryFilterSet


class TestModelCategoryFilterSet:
    def test_str_method_with_category(self):
        category = Category(title="Test Category")
        filter_set = CategoryFilterSet(category=category)

        assert str(filter_set) == category.title  # type: ignore

    def test_str_method_without_category(self):
        image = CategoryFilterSet()
        assert str(image) == image.__class__.__name__
