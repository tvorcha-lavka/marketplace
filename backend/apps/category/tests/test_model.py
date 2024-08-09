import pytest

from apps.category.models import Category


@pytest.mark.django_db
class TestCategoryModel:
    def test_str_method(self):
        category = Category.objects.create(name="Test category", order=1)
        assert str(category) == f"{category.pk}: {category.name}"
