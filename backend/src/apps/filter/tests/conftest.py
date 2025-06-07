from typing import cast
from unittest.mock import patch

import pytest
from deep_translator import DeeplTranslator
from pytest_django import DjangoDbBlocker

from apps.category.models import Category
from apps.category.tests.conftest import *  # noqa: F401, F403
from apps.filter.models import FilterGroup, FilterType, FilterValue
from core.tests.fixtures import *  # noqa: F401, F403

__all__ = [
    "filter_factory",
]


def create_filter_values(filter_type: FilterType, values: list[str]) -> list[FilterValue]:
    return cast(
        list[FilterValue],
        FilterValue.objects.bulk_create(
            [
                FilterValue(
                    filter_type=filter_type,
                    value=value.capitalize(),  # type: ignore[misc]
                )
                for value in values
            ]
        ),
    )


def create_filter_group(category: Category, filter_type: FilterType, values: list[FilterValue]) -> None:
    group = FilterGroup.objects.create(category=category, filter_type=filter_type)
    group.filter_values.set(values)
    group.save()


@pytest.fixture(scope="session")
def filter_factory(
    migrate_categories: None,
    django_db_setup: object,  # noqa: F841
    django_db_blocker: DjangoDbBlocker,
) -> None:
    with django_db_blocker.unblock(), patch.object(DeeplTranslator, "translate", return_value="Translated text"):
        category_1: Category = Category.objects.get(pk=1)
        category_2: Category = Category.objects.get(pk=2)

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
