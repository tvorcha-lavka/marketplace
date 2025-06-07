from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.deconstruct import deconstructible


class BaseRangeValidator:
    def __init__(self, min_value: int | float, max_value: int | float) -> None:
        self.validate_min_value = MinValueValidator(min_value)
        self.validate_max_value = MaxValueValidator(max_value)

    def validate(self, value: int | float) -> None:
        self.validate_min_value(value)
        self.validate_max_value(value)


@deconstructible
class PriceRangeValidator(BaseRangeValidator):
    def __init__(self, min_price: float = 0.0, max_price: float = 99_999_999.99) -> None:
        super().__init__(min_price, max_price)

    def __call__(self, value: float) -> None:
        self.validate(value)


validate_price = PriceRangeValidator()


@deconstructible
class TitleValidator(BaseRangeValidator):
    def __init__(self, min_symbol_count: int = 15, max_symbol_count: int = 50) -> None:
        super().__init__(min_symbol_count, max_symbol_count)

    def __call__(self, value: str) -> None:
        self.validate(len(value))


validate_title = TitleValidator()


@deconstructible
class DescriptionValidator(BaseRangeValidator):
    def __init__(self, min_symbol_count: int = 40, max_symbol_count: int = 4_000) -> None:
        super().__init__(min_symbol_count, max_symbol_count)

    def __call__(self, value: str) -> None:
        self.validate(len(value))


validate_description = DescriptionValidator()
