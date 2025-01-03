from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.deconstruct import deconstructible


class RangeValidator:
    def __init__(self, min_value, max_value):
        self.validate_min_value = MinValueValidator(min_value)
        self.validate_max_value = MaxValueValidator(max_value)

    def __call__(self, value):
        self.validate_min_value(value)
        self.validate_max_value(value)


@deconstructible
class PriceRangeValidator(RangeValidator):
    def __init__(self, min_price=0, max_price=99_999_999.99):
        super().__init__(min_price, max_price)


validate_price = PriceRangeValidator()


@deconstructible
class ImageCountValidator(RangeValidator):
    def __init__(self, min_count=0, max_count=10):
        super().__init__(min_count, max_count)


validate_image_count = ImageCountValidator()


@deconstructible
class ImagePriorityValidator(RangeValidator):
    def __init__(self, min_value=1, max_value=10):
        super().__init__(min_value, max_value)


validate_image_priority = ImagePriorityValidator()


@deconstructible
class TitleValidator(RangeValidator):
    def __init__(self, min_symbol_count=15, max_symbol_count=50):
        super().__init__(min_symbol_count, max_symbol_count)

    def __call__(self, value):
        super().__call__(len(value))


validate_title = TitleValidator()


@deconstructible
class DescriptionValidator(RangeValidator):
    def __init__(self, min_symbol_count=40, max_symbol_count=4_000):
        super().__init__(min_symbol_count, max_symbol_count)

    def __call__(self, value):
        super().__call__(len(value))


validate_description = DescriptionValidator()
