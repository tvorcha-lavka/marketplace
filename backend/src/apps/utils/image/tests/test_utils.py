from typing import Literal

import pytest
from django.core.files.base import ContentFile
from PIL import Image
from pytest_mock import MockerFixture

from apps.utils.image.utils import admin_compress_image, compress_image_to_jpeg


class TestImageCompression:
    @pytest.fixture(autouse=True)
    def setup(self, mocker: MockerFixture) -> None:
        self.mock_image = mocker.MagicMock(spec=Image)
        self.mock_image.copy = mocker.MagicMock(return_value=self.mock_image)
        self.mock_image.convert = mocker.MagicMock(return_value=self.mock_image)
        self.mock_image.save = mocker.Mock()
        self.mock_image.name = "test_image.jpg"
        self.mock_image.format = "JPEG"

        self.mock_open = mocker.patch.object(Image, "open", return_value=self.mock_image)

    @pytest.mark.parametrize("mode", ("RGB", "RGBA"))
    def test_compress_image_to_jpeg(self, mocker: MockerFixture, mode: str) -> None:
        # Setup image mode
        self.mock_image.mode = mode

        # Call function to compress image
        compressed_image = compress_image_to_jpeg(self.mock_image, quality=50)

        # Check that image is open once with correct data
        self.mock_open.assert_called_once_with(self.mock_image)

        if mode == "RGBA":  # Check if image converts to RGB
            self.mock_image.convert.assert_called_once_with("RGB")

        # Check that image saved with correct params
        self.mock_image.save.assert_called_once_with(mocker.ANY, format="JPEG", quality=50)

        # Check that returns right file content
        assert isinstance(compressed_image, ContentFile)
        assert compressed_image.name == "test_image.jpg"

    @pytest.mark.parametrize("output", ("PNG", "JPEG"))
    def test_admin_compress_image(self, mocker: MockerFixture, output: Literal["PNG", "JPEG"]) -> None:
        # Mock functions `compress_image_to_jpeg`
        mock_func = mocker.patch("apps.utils.image.utils.compress_image_to_jpeg", return_value=self.mock_image)

        # Setup format for image
        self.mock_image.format = output

        # Call function to compress image
        compressed_image = admin_compress_image(self.mock_image, output_format=output, quality=50)

        if output == "PNG":  # Check that returns same image
            assert compressed_image == self.mock_image

        else:  # Check that function to compress called with right params
            mock_func.assert_called_once_with(self.mock_image, 50)

    def test_admin_compress_image_invalid_format(self) -> None:
        with pytest.raises(ValueError, match='Invalid output format: "GIF".'):
            admin_compress_image(self.mock_image, output_format="GIF", quality=50)  # type: ignore[arg-type]
