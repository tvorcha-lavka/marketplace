from django.contrib.auth.hashers import make_password
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

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        validated_data["username"] = validated_data["email"].split("@")[0]
        return super().create(validated_data)
