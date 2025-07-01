from typing import Any, Callable, TypeAlias

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from pytest_mock import MockerFixture

from apps.category.middleware import CategoryStatisticMiddleware
from apps.category.models import CardImage, CategoryImage
from apps.category.receivers import (
    compress_category_card_image,
    compress_category_image,
    delete_category_card_image,
    delete_category_image,
    handle_category_purchase,
    handle_category_viewed,
)
from apps.category.tasks import update_category_purchase_task, update_category_views_task
from core.celery.enums import QueueEnum

ModelType: TypeAlias = type[CategoryImage | CardImage]


class TestImageReceivers:

    compress_image_test_cases = (
        (CategoryImage, compress_category_image, "JPEG"),
        (CardImage, compress_category_card_image, "PNG"),
    )

    delete_image_test_cases = (
        (CategoryImage, delete_category_image),
        (CardImage, delete_category_card_image),
    )

    @pytest.mark.parametrize("model, receiver, image_format", compress_image_test_cases)
    def test_compress_category_image(
        self,
        mocker: MockerFixture,
        model: ModelType,
        receiver: Callable[..., Any],
        image_format: str,
    ) -> None:
        # Mock the `admin_compress_image` function
        mock_compress = mocker.patch("apps.category.receivers.admin_compress_image")

        # Create Image object
        image_content = SimpleUploadedFile("test_image.jpg", b"file_content")
        image_content.content_type = f"image/{image_format.lower()}"
        instance = model(image=image_content)

        # Call the receiver
        receiver(sender=model, instance=instance)

        # Check that the compression function has been called
        mock_compress.assert_called_once()

    @pytest.mark.parametrize("model, receiver", delete_image_test_cases)
    def test_delete_category_image(self, mocker: MockerFixture, model: ModelType, receiver: Callable[..., Any]) -> None:
        # Create an instance of the model and mock `image.delete` on the instance
        instance = model(image=mocker.MagicMock())
        mock_delete = mocker.patch.object(instance.image, "delete")

        # Call the receiver
        receiver(sender=model, instance=instance)

        # Check that the delete method was called
        mock_delete.assert_called_once_with(save=False)


class TestStatisticsReceivers:
    def test_handle_category_viewed(self, mocker: MockerFixture) -> None:
        # Mock the `update_category_views_task` task
        mock_task = mocker.patch.object(update_category_views_task, "apply_async")

        # Call the receiver
        handle_category_viewed(sender=CategoryStatisticMiddleware(mocker.ANY), category_id=1)

        # Check that the task has been called once with the correct arguments
        mock_task.assert_called_once_with(args=(1,), queue=QueueEnum.STATISTICS, priority=10)

    def test_handle_category_purchase(self, mocker: MockerFixture) -> None:
        # Mock the `update_category_purchase_task` task
        mock_task = mocker.patch.object(update_category_purchase_task, "apply_async")

        # Call the receiver
        handle_category_purchase(sender=mocker.ANY, category_id=1)

        # Check that the task has been called once with the correct arguments
        mock_task.assert_called_once_with(args=(1,), queue=QueueEnum.STATISTICS, priority=10)
