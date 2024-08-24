import pytest
from django.core.management import call_command

from core.conftest import UserSchema, api_client, auth_client, users  # noqa: F401


# ----- Categories Fixtures --------------------------------------------------------------------------------------------
@pytest.fixture(scope="session")
def migrate_categories(django_db_setup, django_db_blocker):  # noqa: django_db_setup
    with django_db_blocker.unblock():
        call_command("migrate_categories")
