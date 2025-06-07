from pathlib import Path
from unittest.mock import patch

import pytest
from deep_translator import DeeplTranslator
from django.core.management import call_command
from pytest_django import DjangoDbBlocker

from apps.category.choices import CardOrientation
from apps.category.managers import CategoryQuerySet
from apps.category.models import Card, Category
from core.tests.fixtures import *  # noqa: F401, F403

__all__ = [
    "migrate_categories",
    "category_queryset",
    "categories",
]


# ----- Categories Fixtures --------------------------------------------------------------------------------------------
@pytest.fixture(scope="session")
def migrate_categories(django_db_setup: object, django_db_blocker: DjangoDbBlocker) -> None:  # noqa: F841
    with patch.object(DeeplTranslator, "translate", return_value="Translated text"):
        test_dir = Path(__file__).resolve().parent
        test_file_path = test_dir / "data" / "test_categories.json"

        with django_db_blocker.unblock():
            call_command("migrate_categories", file=test_file_path)


@pytest.fixture(scope="session")
def category_queryset(migrate_categories: None, django_db_blocker: DjangoDbBlocker) -> CategoryQuerySet:
    with django_db_blocker.unblock():
        return Category.objects.all()


@pytest.fixture(scope="session")
def categories(
    category_queryset: CategoryQuerySet,
    django_db_blocker: DjangoDbBlocker,
) -> tuple[Category, Category]:
    with django_db_blocker.unblock():
        categories = list(category_queryset)

        horizontal_category = categories[0]
        vertical_category = categories[1]

        cards = [
            Card(category=horizontal_category, orientation=CardOrientation.HORIZONTAL),
            Card(category=vertical_category, orientation=CardOrientation.VERTICAL),
        ]

        Card.objects.bulk_create(cards)

        return horizontal_category, vertical_category
