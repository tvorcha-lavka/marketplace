from rest_framework import serializers

from apps.user.serializers import UserSerializer

from .jwt.serializers import TokenSerializer
from .validators import code_validator, password_validator


class UserAuthSerializer(serializers.Serializer):
    user = UserSerializer()
    token = TokenSerializer()


class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    code = serializers.IntegerField(write_only=True, min_value=100000, max_value=999999)

    def validate(self, attrs):
        code_validator(attrs)
        return attrs


class PasswordResetSerializer(VerifyCodeSerializer):
    password = serializers.CharField(write_only=True, validators=[password_validator])
    message = serializers.CharField(read_only=True)
