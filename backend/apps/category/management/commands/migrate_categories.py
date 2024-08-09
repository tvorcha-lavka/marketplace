import copy

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.category.category_set.__base__ import CATEGORIES
from apps.category.models import Category


class Command(BaseCommand):
    subcategories = []
    model = Category

    def handle(self, *args, **kwargs):
        with transaction.atomic():
            self.migrate_categories()

        message = "Categories updated successfully!"
        self.stdout.write(self.style.SUCCESS(message))

    def migrate_categories(self):
        self.process_subcategories(copy.deepcopy(CATEGORIES))

        while self.subcategories:
            subcategories = self.subcategories
            self.subcategories = []

            for parent, categories in subcategories:
                self.process_subcategories(categories, main_parent=parent)

    def process_subcategories(self, subcategories: list, main_parent: Category = None):
        for category in subcategories:
            subcategories = category.pop("subcategories", [])
            category_obj, created = self.model.objects.update_or_create(category, slug=category.get("slug"))

            if main_parent:
                main_parent.subcategories.add(category_obj)

                parents = [main_parent]
                while parents:
                    for parent in parents:
                        category_obj.parents.add(parent)
                        parents = list(parent.parents.all())

            if subcategories:
                self.subcategories.append((category_obj, subcategories))
