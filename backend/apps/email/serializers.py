from rest_framework import serializers


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    message = serializers.CharField(read_only=True)
