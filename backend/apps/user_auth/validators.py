from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404

from apps.user_auth.models import PasswordResetToken


def password_validator(attrs):
    password = attrs.get("password")
    validate_password(password)
    return attrs


def token_validator(attrs):
    token = attrs.get("token")
    token_obj = get_object_or_404(PasswordResetToken, token=token)

    if not token_obj.is_expired():
        attrs["token_obj"] = token_obj
        return attrs

    raise ValidationError({"detail": "Token has expired."})
