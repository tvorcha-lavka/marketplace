from typing import cast

import pytest
from deep_translator import DeeplTranslator
from django.conf import settings
from django.db import transaction
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from mptt.models import MPTTModel
from pytest_mock import MockerFixture

from apps.category.models import Card, Category, CategoryImage, Statistics


class TestModelCategory:
    def test_str_method(self) -> None:
        category_title = "Test Category"
        category = Category(title=category_title)  # type: ignore[misc]
        assert str(category) == category_title

    def test_save(self, mocker: MockerFixture) -> None:
        # Mock methods in `save` methods
        mock_save = mocker.patch.object(MPTTModel, "save")
        mock_generate_slug = mocker.patch.object(Category, "generate_slug")
        mock_generate_url = mocker.patch.object(Category, "generate_url")
        mock_on_commit = mocker.patch.object(transaction, "on_commit")

        # Create and save instance
        category = Category()
        category.save()

        # Check that methods are called
        mock_save.assert_called_once()
        mock_generate_slug.assert_called_once()
        mock_generate_url.assert_called_once()
        mock_on_commit.assert_called_once_with(category.add_translate_task)

    def test_absolute_url(self) -> None:
        # Create category instance
        category = Category(url="/category-name")

        # Get `absolute_url` property
        absolute_url = category.absolute_url

        # Check that property returns correct value
        assert absolute_url == cast(str, settings.BASE_FRONTEND_URL) + category.url

    @pytest.mark.parametrize("image_attr", (True, False))
    def test_category_image(self, mocker: MockerFixture, image_attr: bool) -> None:
        # Mock an image instance
        mock_image = mocker.MagicMock(spec=CategoryImage)
        mock_image._state = mocker.MagicMock()

        # Create category instance
        category = Category(image=mock_image) if image_attr else Category()  # type: ignore[misc]

        # Get `category_image` property
        image_instance = category.category_image

        if image_attr:  # Check that property returns mocked image instance
            assert image_instance == mock_image

        else:  # Check that property returns default data
            assert isinstance(image_instance, CategoryImage)
            assert image_instance.image.name == "defaults/no-image.jpg"
            assert image_instance.alt == str(_("No image"))

    @pytest.mark.parametrize("card_attr", (True, False))
    def test_category_card(self, mocker: MockerFixture, card_attr: bool) -> None:
        # Mock a card instance
        mock_card = mocker.MagicMock(spec=Card)
        mock_card._state = mocker.MagicMock()

        # Create category instance
        category = Category(card=mock_card) if card_attr else Category()  # type: ignore[misc]

        # Get `category_card` property
        card_instance = category.category_card

        if card_attr:  # Check that property returns mocked card instance
            assert card_instance == mock_card

        else:  # Check that property returns default data
            assert isinstance(card_instance, Card)
            assert card_instance.bg_color == "#D2D2D2"

    @pytest.mark.parametrize("statistics_attr", (True, False))
    def test_category_statistics(self, mocker: MockerFixture, statistics_attr: bool) -> None:
        # Mock a statistics instance
        mock_statistics = mocker.MagicMock(spec=Statistics)
        mock_statistics._state = mocker.MagicMock()

        # Create category instance
        category = Category(statistics=mock_statistics) if statistics_attr else Category()  # type: ignore[misc]

        # Get `category_statistics` property
        statistics_instance = category.category_statistics

        if statistics_attr:  # Check that property returns mocked statistics instance
            assert statistics_instance == mock_statistics

        else:  # Check that property returns default data
            assert isinstance(statistics_instance, Statistics)

    def test_clean(self, mocker: MockerFixture) -> None:
        # Mock `cleanup_url` method
        mock_cleanup_url = mocker.patch.object(Category, "cleanup_url")

        # Create category instance
        category = Category()

        # Call `clean` method
        category.clean()

        # Check that method `cleanup_url` called once
        mock_cleanup_url.assert_called_once()

    def test_cleanup_url(self) -> None:
        # Create category instance
        slug = "category-name"
        category = Category(slug=slug)
        category.url = f"{settings.BASE_FRONTEND_URL}/{slug}"

        # Call `cleanup_url` method
        category.cleanup_url()

        # Check that `cleanup_url` method clean base url
        assert category.url == f"/{category.slug}"

    def test_generate_slug(self, mocker: MockerFixture) -> None:
        title = "Slug Test"
        return_translation = f"Translated {title}"
        mocker.patch.object(DeeplTranslator, "translate", return_value=return_translation)

        category = Category(title=title)  # type: ignore[misc]
        category.generate_slug()

        # Check that the slug was generated correctly
        assert category.slug == slugify(return_translation)

    def test_generate_url(self, mocker: MockerFixture) -> None:
        # Create category instance
        category = Category(slug="test-slug")

        # Mock `get_descendants` and `bulk_update` methods
        mock_get_descendants = mocker.patch.object(category, "get_descendants", return_value=[])
        mock_bulk_update = mocker.patch.object(Category.objects, "bulk_update")

        # Call `generate_url` method
        category.generate_url()

        # Check that `get_descendants` and `bulk_update` methods have not been called
        mock_get_descendants.assert_not_called()
        mock_bulk_update.assert_not_called()

        # Check that the URL has been saved correctly
        assert category.url == f"/{category.slug}"

    def test_generate_url_with_children(self, mocker: MockerFixture) -> None:
        # Create child and parent categories
        parent_category = Category(id=1, slug="parent", url="/parent")
        category = Category(id=2, parent=parent_category, slug="child", url="/old-child-url")

        # Creating mocks for `get_descendants` queryset
        child_category_1 = mocker.MagicMock(url="/old-child-url/descendant-1")
        child_category_2 = mocker.MagicMock(url="/old-child-url/descendant-2")
        descendants_qs = [child_category_1, child_category_2]

        # Mock `get_descendants` and `bulk_update` methods
        mock_get_descendants = mocker.patch.object(category, "get_descendants", return_value=descendants_qs)
        mock_bulk_update = mocker.patch.object(Category.objects, "bulk_update")

        # Call `generate_url` method
        category.generate_url()

        # Check that the `get_descendants` method has been called
        mock_get_descendants.assert_called_once()

        # Check that the URL has been changed to a new one
        assert category.url == "/parent/child"

        # Check that the descendants have received the updated URLs
        assert child_category_1.url == "/parent/child/descendant-1"
        assert child_category_2.url == "/parent/child/descendant-2"

        # Check that bulk_update was called with the correct arguments
        mock_bulk_update.assert_called_once_with(descendants_qs, ["url"])

    @pytest.mark.parametrize("method", ("get_ancestors", "get_children"))
    def test_mptt_methods(self, mocker: MockerFixture, method: str) -> None:
        mock_qs = mocker.MagicMock()
        mock_qs.select_related.return_value = mock_qs
        mock_qs.prefetch_related.return_value = mock_qs
        mock_qs.order_by.return_value = mock_qs

        # Mock method of the base model
        mocker.patch.object(MPTTModel, method, return_value=mock_qs)

        # Create category instance
        category = Category()

        # Call the method
        result = getattr(category, method)()

        # Check the call chain
        mock_qs.select_related.assert_called_once_with("image", "card", "card__image", "statistics")
        mock_qs.prefetch_related.assert_called_once_with("translations")
        mock_qs.order_by.assert_called_once_with("order")

        # Check that the return value is our mocked queryset
        assert result == mock_qs
