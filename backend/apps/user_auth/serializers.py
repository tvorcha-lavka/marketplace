from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from rest_framework.serializers import CharField, EmailField, ModelSerializer, Serializer, URLField, UUIDField

from apps.user.models import User
from apps.user.serializers import UserSerializer

from .validators import password_validator, token_validator


class SocialOAuth2RedirectSerializer(Serializer):
    auth_url = URLField()


class SocialCallbackOAuth2Serializer(Serializer):
    state = CharField(write_only=True, required=True)
    code = CharField(write_only=True, required=True)
    user = UserSerializer(read_only=True)
    refresh = CharField(read_only=True)
    access = CharField(read_only=True)


class SignupSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password", "refresh", "access"]

    password = CharField(write_only=True, required=True)
    default_validators = [password_validator]

    refresh = CharField(read_only=True)
    access = CharField(read_only=True)

    def validate(self, attrs):
        [validator(attrs) for validator in self.default_validators]
        return attrs

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        validated_data["username"] = validated_data["email"].split("@")[0]
        return super().create(validated_data)


class PasswordResetSerializer(Serializer):
    email = EmailField(write_only=True, required=True, validators=[validate_email])


class PasswordResetConfirmSerializer(Serializer):
    token = UUIDField(write_only=True, required=True)
    password = CharField(write_only=True, required=True)
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


class VerifyEmailSerializer(Serializer):
    token = UUIDField(write_only=True, required=True)
