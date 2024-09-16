from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from rest_framework import serializers

from apps.user.models import User
from apps.user.serializers import UserSerializer

from .validators import code_validator, password_validator


class TokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField()


class UserAuthSerializer(serializers.Serializer):
    user = UserSerializer()
    token = TokenSerializer()


class SocialOAuth2RedirectSerializer(serializers.Serializer):
    auth_url = serializers.URLField()


class SocialCallbackOAuth2Serializer(serializers.Serializer):
    state = serializers.CharField(write_only=True, required=True)
    code = serializers.CharField(write_only=True, required=True)


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password", "message"]

    password = serializers.CharField(write_only=True, validators=[password_validator])
    message = serializers.CharField(read_only=True)

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        validated_data["username"] = validated_data["email"].split("@")[0]
        return super().create(validated_data)


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True, validators=[validate_email])
    message = serializers.CharField(read_only=True)


class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True, validators=[validate_email])
    code = serializers.IntegerField(write_only=True, min_value=100000, max_value=999999)

    def validate(self, attrs):
        code_validator(attrs)
        return attrs


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True, validators=[validate_email])
    password = serializers.CharField(write_only=True, validators=[password_validator])
    code = serializers.IntegerField(write_only=True, min_value=100000, max_value=999999)
    message = serializers.CharField(read_only=True)

    def validate(self, attrs):
        code_validator(attrs)
        return attrs
