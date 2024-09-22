from rest_framework import serializers

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
