import pytest
from PIL import Image
from rest_framework.exceptions import ValidationError

from apps.utils.image.validators import validate_image_resolution, validate_image_size


class TestValidators:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.mock_image = mocker.MagicMock(spec=Image)
        mocker.patch.object(Image, "open", return_value=self.mock_image)

    @pytest.mark.parametrize("is_valid", (True, False))
    def test_validate_image_size(self, is_valid):
        # Setting the size in bytes
        self.mock_image.size = 4 * 1024 * 1024 if is_valid else 6 * 1024 * 1024

        if is_valid:  # Validation runs without errors
            validate_image_size(self.mock_image)

        else:  # Waiting for validation error
            with pytest.raises(ValidationError, match="Image file too large"):
                validate_image_size(self.mock_image)

    @pytest.mark.parametrize("is_valid", (True, False))
    def test_validate_image_resolution(self, is_valid):
        # Setting the image resolution
        self.mock_image.size = (3000, 4000) if is_valid else (3500, 4500)

        if is_valid:  # Validation runs without errors
            validate_image_resolution(self.mock_image)

        else:  # Waiting for validation error
            with pytest.raises(ValidationError, match="Image resolution is too high"):
                validate_image_resolution(self.mock_image)
