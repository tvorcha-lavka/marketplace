from rest_framework import serializers

from apps.user.models import SellerProfile, User


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


class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = ["id", "username", "date_joined", "last_active", "rating"]

    id = serializers.UUIDField(source="pk")  # noqa: VNE003
    username = serializers.CharField(source="public_username")
    date_joined = serializers.DateTimeField(source="user.date_joined")
    last_active = serializers.DateTimeField(source="user.last_login")
    rating = serializers.FloatField(source="average_rating")
