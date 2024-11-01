from pathlib import Path
from unittest.mock import patch

import pytest
from deep_translator import DeeplTranslator
from django.core.management import call_command

from apps.category.choices import CardOrientation
from apps.category.models import Card, Category
from core.conftest import UserSchema, api_client, auth_client, users  # noqa: F401


# ----- Categories Fixtures --------------------------------------------------------------------------------------------
@pytest.fixture(scope="session")
def migrate_categories(django_db_setup, django_db_blocker):  # noqa: django_db_setup
    with patch.object(DeeplTranslator, "translate", return_value="Translated text"):
        test_dir = Path(__file__).resolve().parent
        test_file_path = test_dir / "data" / "test_categories.json"

        with django_db_blocker.unblock():
            call_command("migrate_categories", file=test_file_path)


@pytest.fixture(scope="session")
def category_queryset(migrate_categories, django_db_blocker):
    with django_db_blocker.unblock():
        return Category.objects.all()


@pytest.fixture(scope="session")
def categories(category_queryset, django_db_blocker):
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
