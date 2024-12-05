import pytest
from django.db.models import QuerySet

from apps.review.models import Review, UserReview
from apps.user.models import User


class TestReview:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.instance = Review(ratings_count=1, reviews_count=1, avg_rating=1.00)

    def test_str_method(self):
        expected_result = (
            f"for '{self.instance.content_object}'; "
            f"Ratings count: {self.instance.ratings_count}; "
            f"Reviews count: {self.instance.reviews_count}; "
            f"Average rating: {self.instance.avg_rating:.1f}"
        )

        # Assert the expected behavior
        assert str(self.instance) == expected_result

    def test_calculate(self, mocker):
        review_data = {"ratings_count": 5, "reviews_count": 3, "avg_rating": 4.5}

        # Mock aggregates
        mock_user_reviews = mocker.MagicMock(spec=QuerySet)
        mock_user_reviews.aggregate.return_value = review_data

        # Mock `user_reviews` as a property
        mocker.patch.object(
            type(self.instance),
            "user_reviews",
            new_callable=mocker.PropertyMock,
            return_value=mock_user_reviews,
        )

        # Mock `save` method
        mocker.patch.object(self.instance, "save", return_value=None)

        # Call the method
        self.instance.calculate()

        # Assert the expected behavior
        assert self.instance.ratings_count == review_data.get("ratings_count")
        assert self.instance.reviews_count == review_data.get("reviews_count")
        assert self.instance.avg_rating == review_data.get("avg_rating")


class TestUserReview:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.user = User(pk=1, username="test_user")
        self.review = Review(ratings_count=1, reviews_count=1, avg_rating=1.00, content_object=None)
        self.instance = UserReview(score=1, message="test message", user=self.user, review=self.review)

    def test_str_method(self):
        expected_result = (
            f"from '{self.instance.user}' to '{self.review.content_object}'; "
            f"Score: {self.instance.score}; "
            f"Review: '{self.instance.message[:20]}...'"
        )

        # Assert the expected behavior
        assert str(self.instance) == expected_result

    def test_update(self, mocker):
        # Mock `save` method
        mocker.patch.object(self.instance, "save", return_value=None)

        # Call the method
        result = self.instance.update(score=2, message="updated message")

        # Assert the expected behavior
        assert result == self.instance
