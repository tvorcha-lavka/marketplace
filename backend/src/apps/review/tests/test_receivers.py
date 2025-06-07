from pytest_mock import MockerFixture

from apps.review.models import Review, UserReview
from apps.review.receivers import calculate_reviews


def test_calculate_reviews(mocker: MockerFixture) -> None:
    # Prepare test data
    review = Review(ratings_count=1, reviews_count=1, avg_rating=1.00, content_object=None)
    user_review = UserReview(score=1, message="test message", review=review)

    # Mock dependencies
    mock_calculate = mocker.patch.object(review, "calculate")

    # Call the receiver
    calculate_reviews(sender=UserReview(), instance=user_review)

    # Assert the expected behavior
    mock_calculate.assert_called_once_with()
