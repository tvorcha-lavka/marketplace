from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.validators import EmailValidator, RegexValidator
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _

__all__ = [
    "validate_name",
    "validate_email",
    "validate_username",
    "validate_phone_number",
]


@deconstructible
class NameValidator(RegexValidator):
    regex = r"^[A-Za-zА-Яа-яІіЄєЇї]+$"
    message = _("Enter a valid name containing only letters.")
    flags = 0


@deconstructible
class PhoneNumberValidator(RegexValidator):
    # https://github.com/mnestorov/regex-patterns/blob/main/README.md
    # fmt: off
    data = {
        "UA": r"^\+380[0-9]{9}$",               # Ukraine
        "PL": r"^\+48[0-9]{9}$",                # Poland
        "DE": r"^\+49[1-9][0-9]{1,14}$",        # Germany
        "NL": r"^\+31[0-9]{9}$",                # Netherlands
        "GB": r"^\+44[1-9][0-9]{9,10}$",        # United Kingdom
    }
    # fmt: on

    regex = "|".join(data.values())
    message = _(f"Enter a valid phone number with country code. Available countries: {'|'.join(data.keys())}")
    flags = 0


validate_name = NameValidator()
validate_email = EmailValidator()
validate_username = UnicodeUsernameValidator()
validate_phone_number = PhoneNumberValidator()
