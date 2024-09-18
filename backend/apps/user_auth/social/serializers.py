from rest_framework import serializers


class SocialOAuth2RedirectSerializer(serializers.Serializer):
    auth_url = serializers.URLField()


class SocialCallbackOAuth2Serializer(serializers.Serializer):
    state = serializers.CharField(write_only=True, required=True)
    code = serializers.CharField(write_only=True, required=True)
