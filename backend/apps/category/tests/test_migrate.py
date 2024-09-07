import copy
import json
from pathlib import Path

import pytest

from apps.category.models import Category


@pytest.mark.django_db
class TestMigrate:
    total_categories = 0

    @staticmethod
    def extract_categories_form_json():
        test_dir = Path(__file__).resolve().parent
        test_file_path = test_dir / "data" / "test_categories.json"

        with open(test_file_path, "r", encoding="utf-8") as file:
            return json.load(file)

    @pytest.mark.usefixtures("migrate_categories")
    def test_migrate_categories(self):
        categories = self.extract_categories_form_json()
        self.count_categories(copy.deepcopy(categories))
        categories_count = Category.objects.count()

        assert categories_count == self.total_categories

    def count_categories(self, categories):
        while categories:
            self.total_categories += 1
            current = categories.pop()
            children = current.get("children", [])

            if children:
                categories.extend(children)
