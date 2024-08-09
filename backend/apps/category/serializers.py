from rest_framework import serializers

from .models import Category

__all__ = [
    "CategorySerializer",
    "CategoryDetailSerializer",
]


class TopLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "order", "name", "slug", "url"]


class RecursiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "order", "name", "slug", "url", "subcategories"]

    subcategories = serializers.SerializerMethodField()

    def get_subcategories(self, obj):
        return self.__class__(obj.subcategories.all(), many=True).data


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "order", "name", "slug", "url", "subcategories"]

    subcategories = RecursiveSerializer(many=True, read_only=True)


class CategoryDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "order", "name", "description", "slug", "url", "active", "parents", "subcategories"]

    parents = TopLevelSerializer(many=True, read_only=True)
    subcategories = TopLevelSerializer(many=True, read_only=True)
