from django.conf import settings
from django.forms import ImageField

from apps.category.models import Card, CardImage, Category


class TestModelCardImage:
    def test_str_method_with_category(self):
        category = Category(title="Test Category")
        card = Card(category=category)
        image = CardImage(card=card)

        assert str(image) == category.title  # type: ignore

    def test_str_method_without_category(self):
        image = CardImage()
        assert str(image) == image.__class__.__name__

    def test_absolute_url(self, mocker):
        # Mock image field
        image = mocker.MagicMock(spec=ImageField)
        image.name = "category/card/test/image.jpg"  # returns after instance save

        # Create card image instance
        instance = CardImage(image=image)

        # Get `absolute_url` property
        absolute_url = instance.absolute_url

        # Check that property returns correct value
        assert absolute_url == f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{instance.image.name}"
