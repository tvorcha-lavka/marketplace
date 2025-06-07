from typing import Any

from rest_framework import serializers


class EmailSerializer(serializers.Serializer[dict[str, Any]]):
    email = serializers.EmailField()
    message = serializers.CharField(read_only=True)
