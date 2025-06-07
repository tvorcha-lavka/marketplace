from django.conf import settings
from django.forms import ImageField
from pytest_mock import MockerFixture

from apps.category.models import Card, CardImage, Category


class TestModelCardImage:

    def test_str_method_with_category(self) -> None:
        category = Category(title="Test Category")  # type: ignore[misc]
        card = Card(category=category)
        image = CardImage(card=card)

        assert str(image) == category.category_title

    def test_str_method_without_category(self) -> None:
        image = CardImage()
        assert str(image) == image.__class__.__name__

    def test_absolute_url(self, mocker: MockerFixture) -> None:
        # Mock image field
        image = mocker.MagicMock(spec=ImageField)
        image.name = "category/card/test/image.jpg"  # returns after instance save

        # Create card image instance
        instance = CardImage(image=image)

        # Get `absolute_url` property
        absolute_url = instance.absolute_url

        # Check that property returns correct value
        assert absolute_url == f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{instance.image.name}"
