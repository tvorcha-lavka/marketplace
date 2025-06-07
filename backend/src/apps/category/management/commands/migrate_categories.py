import copy
import json
import sys
from pathlib import Path
from typing import Any, cast

from django.core.management.base import BaseCommand, CommandParser
from django.db import transaction
from django.utils.translation import activate

from apps.category.models import Category

app_dir = Path(__file__).resolve().parent.parent.parent
default_file_path = app_dir / "data" / "categories.json"


class Command(BaseCommand):
    total_categories = 0
    processed_count = 0
    model = Category

    @staticmethod
    def extract_categories_form_json(file_path: str = "") -> list[dict[str, Any]]:
        json_file_path = default_file_path if not file_path else file_path
        with open(json_file_path, "r", encoding="utf-8") as file:
            return cast(list[dict[str, Any]], json.load(file))

    def add_arguments(self, parser: CommandParser) -> None:
        help_message = 'default path: "app/categories/data/categories.json"'
        parser.add_argument("--file", type=str, help=help_message)

    def handle(self, *args: Any, **kwargs: Any) -> None:
        activate("uk")

        # Step 1: Extract list of categories
        file_path = kwargs["file"]
        categories = self.extract_categories_form_json(file_path)

        # Step 2: Count categories and writing to the console
        self.count_categories(copy.deepcopy(categories))
        message = "Total categories to process: "
        self.stdout.write(message + str(self.total_categories))

        # Step 3: Writing to the database
        with transaction.atomic():
            self.migrate_categories(copy.deepcopy(categories))

        # Step 4: Writing status to the console
        message = "\nCategories updated successfully!"
        self.stdout.write(self.style.SUCCESS(message))

    def migrate_categories(self, categories: list[dict[str, Any]], parent: Category | None = None) -> None:
        for category in categories:
            category["parent"] = parent
            children_categories = category.pop("children", [])

            # Step 1: Create or Update a category by its url
            url = f"{parent.url}/{category.get('slug')}" if parent else f"/{category.get('slug')}"
            category_obj, created = self.model.objects.update_or_create(url=url, defaults=category)

            # Step 2: Writing progress to the console
            self.print_progress()

            # Step 3: Recursive create child categories
            if children_categories:
                self.migrate_categories(children_categories, category_obj)

    def count_categories(self, categories: list[dict[str, Any]]) -> None:
        while categories:
            self.total_categories += 1
            current = categories.pop()
            children = current.get("children", [])

            if children:
                categories.extend(children)

    def print_progress(self) -> None:
        self.processed_count += 1
        count = f"{self.processed_count}/{self.total_categories}"
        percent = eval(count) * 100

        message = f"\rProgress: {count} [{percent:.1f}%]"
        sys.stdout.write(message)
        sys.stdout.flush()
