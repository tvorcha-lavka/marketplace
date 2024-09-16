import shutil
from pathlib import Path
from unittest.mock import patch

import pytest
from django.conf import settings
from django.core.management import call_command

from core.conftest import UserSchema, api_client, auth_client, users  # noqa: F401


# ----- Categories Fixtures --------------------------------------------------------------------------------------------
@pytest.fixture(scope="class")
def cleanup_media():
    """Cleaning up the media folder after tests."""
    yield
    shutil.rmtree(settings.MEDIA_ROOT, ignore_errors=True)


@pytest.fixture(scope="session")
def mock_translator():
    with patch("apps.category.models.DeeplTranslator") as mock:
        yield mock


@pytest.fixture(scope="session")
def migrate_categories(mock_translator, django_db_setup, django_db_blocker):  # noqa: django_db_setup
    mock_translator_instance = mock_translator.return_value
    mock_translator_instance.translate.return_value = "Translated text"

    test_dir = Path(__file__).resolve().parent
    test_file_path = test_dir / "data" / "test_categories.json"

    with django_db_blocker.unblock():
        call_command("migrate_categories", file=test_file_path)
