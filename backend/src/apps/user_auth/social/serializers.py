from typing import Any

from rest_framework import serializers


class SocialOAuth2RedirectSerializer(serializers.Serializer[dict[str, Any]]):
    auth_url = serializers.URLField()


class SocialCallbackOAuth2Serializer(serializers.Serializer[dict[str, Any]]):
    state = serializers.CharField(write_only=True, required=True)
    code = serializers.CharField(write_only=True, required=True)
