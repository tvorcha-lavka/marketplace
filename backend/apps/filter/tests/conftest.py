from unittest.mock import patch

import pytest
from deep_translator import DeeplTranslator

from apps.category.models import Category
from apps.category.tests.conftest import UserSchema, api_client, auth_client, migrate_categories, users  # noqa: F401
from apps.filter.models import FilterGroup, FilterType, FilterValue


def create_filter_values(filter_type, values):
    obj = FilterValue.objects
    return list(map(lambda v: obj.create(filter_type=filter_type, value=v.capitalize()), values))


def create_filter_group(category, filter_type, values):
    group = FilterGroup.objects.create(category=category, filter_type=filter_type)
    group.filter_values.set(values)
    group.save()


@pytest.fixture(scope="session")
def filter_factory(migrate_categories, django_db_setup, django_db_blocker):  # noqa: F811, F841
    with django_db_blocker.unblock(), patch.object(DeeplTranslator, "translate", return_value="Translated text"):
        category_1, category_2 = Category.objects.get(pk=1), Category.objects.get(pk=2)

        filter_data = {
            "material": {
                category_1: ["clay", "chamotte-clay", "porcelain", "polymer-clay"],
                category_2: ["wood", "faience", "terracotta", "ceramic-mass"],
            },
            "style": {
                category_1: ["ethno", "minimalism", "modern", "classic"],
                category_2: ["boho", "provence", "vintage", "loft"],
            },
            "processing-type": {
                category_2: ["glazed", "unglazed", "watered", "patinated"],
            },
        }

        for name, categories in filter_data.items():
            filter_type = FilterType.objects.create(name=name.capitalize())

            for category, values in categories.items():
                value_objs = create_filter_values(filter_type, values)
                create_filter_group(category, filter_type, value_objs)
