from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404

from apps.user.models import User
from apps.user_auth.models import PasswordResetToken, VerificationCode


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


def code_validator(attrs):
    code = attrs.get("code")
    email = attrs.get("email")

    user = get_object_or_404(User, email=email)
    code_obj = get_object_or_404(VerificationCode, user=user)

    if code != int(code_obj):
        raise ValidationError({"detail": "Invalid code."})

    if code_obj.is_expired():
        raise ValidationError({"detail": "Code has expired."})

    attrs["code_obj"] = code_obj
    attrs["user"] = user
    return attrs
