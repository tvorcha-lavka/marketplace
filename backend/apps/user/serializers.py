from rest_framework import serializers

from apps.user.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "username", "first_name", "last_name", "phone_number", "language"]

    email = serializers.EmailField(read_only=True)

    def save(self, **kwargs):
        for key, value in self.validated_data.items():
            if key in ["first_name", "last_name"]:
                self.validated_data[key] = value.capitalize()

        return super().save(**kwargs)


class PublicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "date_joined", "last_active"]  # TODO: rating

    last_active = serializers.DateTimeField(source="last_login")
