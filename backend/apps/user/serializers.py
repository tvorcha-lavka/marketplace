from rest_framework.serializers import EmailField, ModelSerializer

from apps.user.models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "username", "first_name", "last_name", "phone_number"]

    email = EmailField(read_only=True)

    def save(self, **kwargs):
        for key, value in self.validated_data.items():
            if key in ["first_name", "last_name"]:
                self.validated_data[key] = value.capitalize()

        return super().save(**kwargs)
