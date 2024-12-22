import pytest
from django.utils.translation import gettext_lazy as _

from apps.category.models import Card, CardImage, Category


class TestModelCard:
    def test_str_method_with_category(self):
        category = Category(title="Test Category")
        card = Card(category=category)

        assert str(card) == category.title  # type: ignore

    def test_str_method_without_category(self):
        card = Card()
        assert str(card) == card.__class__.__name__

    @pytest.mark.parametrize("image_attr", (True, False))
    def test_card_image(self, mocker, image_attr):
        # Mock an image instance
        mock_image = mocker.MagicMock(spec=CardImage)
        mock_image._state = mocker.MagicMock()

        # Create card instance
        card = Card(image=mock_image) if image_attr else Card()

        # Get `card_image` property
        image_instance = card.card_image

        if image_attr:  # Check that property returns mocked image instance
            assert image_instance == mock_image

        else:  # Check that property returns default data
            assert isinstance(image_instance, CardImage)
            assert image_instance.image.name == "logo/logo_white.svg"
            assert image_instance.alt == _("Default card image")
