import pytest
from django.utils.translation import gettext_lazy as _

from apps.category.models import Card, CardImage, Category


class TestModelCard:
    def test_str_method_with_category(self) -> None:
        category = Category(title="Test Category")  # type: ignore[misc]
        card = Card(category=category)

        assert str(card) == category.category_title

    def test_str_method_without_category(self) -> None:
        card = Card()
        assert str(card) == card.__class__.__name__

    @pytest.mark.parametrize("image_attr", (True, False))
    def test_card_image(self, image_attr: bool) -> None:
        # Create card instance
        test_image = CardImage(image="test_image.jpg")
        card = Card(image=test_image) if image_attr else Card()  # type: ignore[misc]

        # Get `card_image` property
        image_instance = card.card_image

        if image_attr:  # Check that property returns mocked image instance
            assert image_instance == test_image
            assert image_instance.image.name == "test_image.jpg"
            assert image_instance.alt == ""

        else:  # Check that property returns default data
            assert isinstance(image_instance, CardImage)
            assert image_instance.image.name == "logo/logo_white.svg"
            assert image_instance.alt == str(_("Default card image"))
