from datetime import timedelta
from typing import Any, Dict

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from apps.user.models import User
from apps.user_auth.validators import password_validator


class TokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField()


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password", "message"]

    password = serializers.CharField(write_only=True, validators=[password_validator])
    message = serializers.CharField(read_only=True)


class CustomTokenObtainPairSerializer(TokenObtainSerializer):
    remember_me = serializers.BooleanField(default=False)
    token_class = RefreshToken

    def validate(self, attrs: Dict[str, Any]) -> Dict[Any, Any]:
        data = super().validate(attrs)

        remember_me = attrs.get("remember_me", False)

        refresh = self.get_token(self.user)
        refresh.set_exp(lifetime=timedelta(days=30 if remember_me else 1))

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)  # type: ignore

        return data
