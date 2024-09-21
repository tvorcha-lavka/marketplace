from rest_framework import serializers


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    message = serializers.CharField(read_only=True)
