import copy

import pytest

from apps.category.category_set.__base__ import CATEGORIES
from apps.category.models import Category


@pytest.mark.django_db
class TestMigrate:

    @property
    def count_categories(self, count=0):
        stack = copy.deepcopy(CATEGORIES)

        while stack:
            count += 1
            current = stack.pop()
            subcategories = current.get("subcategories")

            if subcategories:
                stack.extend(subcategories)

        return count

    @pytest.mark.usefixtures("migrate_categories")
    def test_migrate_categories(self):
        categories_count = Category.objects.count()
        assert categories_count == self.count_categories
