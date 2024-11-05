from django.conf import settings
from rest_framework import serializers

from .models import Card, CardImage, Category, CategoryImage


class CategoryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryImage
        fields = ["url", "alt"]

    url = serializers.URLField(
        source="absolute_url",
        default=Meta.model().absolute_url + "category/category-name/image.jpeg",
    )


class CardImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardImage
        fields = ["url", "alt", "size", "x_axis", "y_axis"]

    url = serializers.URLField(
        source="absolute_url",
        default=Meta.model().absolute_url + "category/category-name/card/card.png",
    )


class CardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Card
        fields = ["orientation", "title_position", "text_wrap", "bg_color", "image"]

    image = CardImageSerializer(source="card_image")


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        # fmt: off
        fields = [
            "id", "active", "name", "title", "popularity_score", "parent_id",
            "order", "lft", "rght", "level", "url", "image", "card",
        ]
        # fmt: on

    card = CardSerializer(source="category_card")
    image = CategoryImageSerializer(source="category_image")
    name = serializers.SlugField(source="slug", default="category-name")
    popularity_score = serializers.FloatField(source="category_statistics.popularity_score", default=0)
    url = serializers.URLField(source="absolute_url", default=settings.BASE_FRONTEND_URL + "/category-name")


class CategoryDetailSerializer(CategorySerializer):
    class Meta:
        model = Category
        fields = CategorySerializer.Meta.fields + ["parents", "children"]

    parents = serializers.ListField(child=CategorySerializer(), source="get_ancestors")
    children = serializers.ListField(child=CategorySerializer(), source="get_children")


class CatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "parent_id", "name", "title", "url", "image"]

    name = serializers.SlugField(source="slug", default="category-name")
    image = CategoryImageSerializer(source="category_image")
