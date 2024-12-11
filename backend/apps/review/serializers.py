from rest_framework import serializers

from .models import UserReview


class RatingWithReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReview
        fields = ["user", "score", "message"]

    score = serializers.IntegerField(min_value=1, max_value=5)
    user = serializers.StringRelatedField(read_only=True)
