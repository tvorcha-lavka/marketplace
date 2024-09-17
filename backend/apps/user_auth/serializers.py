from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from rest_framework import serializers

from apps.user.models import User
from apps.user.serializers import UserSerializer

from .validators import code_validator, password_validator, token_validator


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

    password = serializers.CharField(write_only=True, required=True)
    message = serializers.CharField(read_only=True)
    default_validators = [password_validator]

    def validate(self, attrs):
        [validator(attrs) for validator in self.default_validators]
        return attrs

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        validated_data["username"] = validated_data["email"].split("@")[0]
        return super().create(validated_data)


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True, required=True, validators=[validate_email])


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.UUIDField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)
    default_validators = [password_validator, token_validator]

    def validate(self, attrs):
        [validator(attrs) for validator in self.default_validators]
        return attrs

    def create(self, validated_data):
        token_obj = validated_data.get("token_obj")
        password = validated_data.get("password")

        user = token_obj.user
        user.set_password(password)
        user.save()

        token_obj.delete()
        return user


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True, required=True)
    code = serializers.IntegerField(write_only=True, required=True)
    default_validators = [code_validator]

    def validate(self, attrs):
        [validator(attrs) for validator in self.default_validators]
        return attrs
