from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404

from apps.user_auth.models import VerificationCode

password_validator = validate_password


def code_validator(attrs):
    code = attrs.get("code")
    email = attrs.get("email")

    code_obj = get_object_or_404(VerificationCode, email=email)

    if code != int(code_obj):
        raise ValidationError({"detail": _("Invalid code.")})

    if code_obj.is_expired():
        raise ValidationError({"detail": _("Code has expired.")})

    attrs["code_obj"] = code_obj
    return attrs
