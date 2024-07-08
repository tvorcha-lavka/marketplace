from rest_framework.serializers import CharField, Serializer

from apps.user.serializers import UserSerializer


class GoogleOAuth2Serializer(Serializer):
    code = CharField(write_only=True, required=True)
    user = UserSerializer(read_only=True)
    refresh = CharField(read_only=True)
    access = CharField(read_only=True)
