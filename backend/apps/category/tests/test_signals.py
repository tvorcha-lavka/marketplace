import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.category.models import CardImage, CategoryImage
from apps.category.signals import (
    compress_category_card_image,
    compress_category_image,
    delete_category_card_image,
    delete_category_image,
)


class TestImageSignals:

    compress_image_test_cases = (
        (CategoryImage, compress_category_image, "JPEG"),
        (CardImage, compress_category_card_image, "PNG"),
    )

    delete_image_test_cases = (
        (CategoryImage, delete_category_image),
        (CardImage, delete_category_card_image),
    )

    @pytest.mark.parametrize("model, signal, image_format", compress_image_test_cases)
    def test_compress_category_image(self, mocker, model, signal, image_format):
        mock_compress = mocker.patch("apps.category.signals.admin_compress_image")

        # Create Image object
        image_content = SimpleUploadedFile("test_image.jpg", b"file_content")
        image_content.content_type = f"image/{image_format.lower()}"
        instance = model(image=image_content)

        # Call the signal
        signal(sender=model, instance=instance)

        # Check that the compression function has been called
        mock_compress.assert_called_once()

    @pytest.mark.parametrize("model, signal", delete_image_test_cases)
    def test_delete_category_image(self, mocker, model, signal):
        # Create an instance of the model and mock `image.delete` on the instance
        instance = model(image=mocker.MagicMock())
        instance.image.delete = mocker.MagicMock()

        # Call the signal
        signal(sender=model, instance=instance)

        # Check that the delete method was called
        instance.image.delete.assert_called_once_with(save=False)
