import pytest

from apps.category.models import Card, CardImage, Category, CategoryImage
from apps.category.utils import category_card_images_upload_to, category_images_upload_to


class TestUploadTo:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.category = Category(title="Test Category", slug="test-category")
        self.card = Card(category=self.category)

    def test_category_images_upload_to(self):
        folder_name = self.category.slug
        filename = "test-category-image.jpeg"

        image = CategoryImage(category=self.category, image=filename)
        upload_to = category_images_upload_to(image, filename)

        assert upload_to == f"category/{folder_name}/{filename}"

    def test_category_card_images_upload_to(self):
        folder_name = self.card.category.slug
        filename = "test-card-image.jpeg"

        image = CardImage(card=self.card, image=filename)
        upload_to = category_card_images_upload_to(image, filename)

        assert upload_to == f"category/{folder_name}/card/{filename}"
