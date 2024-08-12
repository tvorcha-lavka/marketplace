import pytest
from django.contrib.admin.sites import site

from apps.category.models import Category


@pytest.mark.django_db
class TestAdminPanel:
    def test_get_parents(self):
        category = Category.objects.create(name="Test Category", slug="test-category", order=1)
        parent_category = Category.objects.create(name="Parent Category", slug="parent-category", order=1)
        category.parents.add(parent_category)

        admin_instance = site._registry[Category]
        result = admin_instance.get_parents(category)

        assert result == f"[{parent_category.pk}] {parent_category.name}"
