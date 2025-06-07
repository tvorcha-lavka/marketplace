from typing import Any

from django.core.validators import validate_email
from rest_framework import serializers

from apps.user.serializers import UserSerializer

from .jwt.serializers import TokenSerializer
from .validators import code_validator, password_validator


class UserAuthSerializer(serializers.Serializer[dict[str, Any]]):
    user = UserSerializer()
    token = TokenSerializer()


class VerifyCodeSerializer(serializers.Serializer[dict[str, Any]]):
    email = serializers.EmailField(validators=[validate_email])
    code = serializers.IntegerField(write_only=True, min_value=100000, max_value=999999)
    message = serializers.CharField(read_only=True)

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        code_validator(attrs)
        return attrs


class PasswordResetSerializer(VerifyCodeSerializer):
    password = serializers.CharField(write_only=True, validators=[password_validator])
