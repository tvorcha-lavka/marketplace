from rest_framework import serializers

from .models import Category, TitlePosition


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        # fmt: off
        fields = [
            "id", "name", "title", "title_pos", "score", "parent_id",
            "order", "lft", "rght", "level", "active", "href", "image",
        ]
        # fmt: on

    title = serializers.SerializerMethodField()
    title_pos = serializers.ChoiceField(source="get_image_title_position", choices=TitlePosition)
    href = serializers.URLField(source="absolute_url")
    score = serializers.FloatField(source="get_popularity_score")

    def get_title(self, obj):
        request = self.context.get("request")
        language = request.GET.get("lang", None)  # if lang in query params
        return obj.get_translated_title(language) if language else obj.title


class CategoryDetailSerializer(CategorySerializer):
    class Meta:
        model = Category
        fields = CategorySerializer.Meta.fields + ["parents", "children"]

    parents = serializers.ListField(child=CategorySerializer(), source="get_ancestors")
    children = serializers.ListField(child=CategorySerializer(), source="get_children")
