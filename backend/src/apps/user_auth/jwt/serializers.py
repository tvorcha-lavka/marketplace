from typing import Any

from django.contrib.auth.models import update_last_login
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework_simplejwt.serializers import TokenRefreshSerializer as BaseTokenRefreshSerializer
from rest_framework_simplejwt.settings import api_settings

from apps.user.models import User
from apps.user_auth.jwt.tokens import RefreshToken
from apps.user_auth.validators import password_validator


class TokenSerializer(serializers.Serializer[RefreshToken]):
    refresh = serializers.CharField()
    access = serializers.CharField()


class SignupSerializer(serializers.ModelSerializer[User]):
    class Meta:
        model = User
        fields = ["email", "password", "message"]

    password = serializers.CharField(write_only=True, validators=[password_validator])
    message = serializers.CharField(read_only=True)


class TokenObtainPairSerializer(TokenObtainSerializer):
    remember_me = serializers.BooleanField(default=False)
    token_class = RefreshToken

    def validate(self, attrs: dict[str, Any]) -> dict[str, str]:
        data = super().validate(attrs)

        assert self.user is not None
        refresh = self.token_class.for_user_x(self.user, attrs)

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(User, self.user)

        return data


class TokenRefreshSerializer(BaseTokenRefreshSerializer):
    token_class = RefreshToken
