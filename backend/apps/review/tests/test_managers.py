import pytest
from django.contrib.contenttypes.models import ContentTypeManager
from django.db.models import QuerySet
from rest_framework.exceptions import NotFound, ValidationError

from apps.review.models import Review, UserReview
from apps.review.models.manager import ReviewManager, UserReviewManager
from apps.user.models import User


class TestReviewManager:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.manager = Review.objects
        self.user = mocker.MagicMock(spec=User)
        self.instance = mocker.MagicMock(spec=User)
        self.review_object = mocker.MagicMock(spec=UserReview)

    @pytest.mark.parametrize("rise_exception", (True, False))
    def test_check_instance(self, rise_exception):
        if rise_exception:
            with pytest.raises(TypeError):
                self.manager.check_instance(Review(), "test_method")
        else:
            self.manager.check_instance(self.instance, "test_method")

    @pytest.mark.parametrize("review_exists", (True, False))
    def test_make_review(self, mocker, review_exists):
        data = {"instance": self.instance, "user": self.user, "score": 5, "message": "test message"}

        # Mock main dependencies
        mocker.patch.object(UserReviewManager, "can_review")
        mocker.patch.object(UserReviewManager, "get_review_by_user", return_value=review_exists)

        if review_exists:
            # Assert the expected behavior
            with pytest.raises(ValidationError):
                self.manager.make_review(**data)

        else:
            # Mock dependencies
            mocker.patch.object(ContentTypeManager, "get_for_model", return_value=mocker.MagicMock())
            mocker.patch.object(ReviewManager, "get_or_create", return_value=(self.review_object, True))
            mock_create = mocker.patch.object(UserReviewManager, "create")

            # Call the method
            self.manager.make_review(**data)

            # Assert the expected behavior
            mock_create.assert_called_once_with(
                user=data.get("user"),
                score=data.get("score"),
                message=data.get("message"),
                review=self.review_object,
            )

    @pytest.mark.parametrize("review_exists", (True, False))
    def test_update_review(self, mocker, review_exists):
        review_by_user = self.review_object if review_exists else None
        kwargs = {"score": 5, "message": "test message"}

        # Mock main dependencies
        mocker.patch.object(UserReviewManager, "get_review_by_user", return_value=review_by_user)

        if not review_exists:
            # Assert the expected behavior
            with pytest.raises(NotFound):
                self.manager.update_review(self.instance, self.user, **kwargs)

        else:
            # Mock dependencies
            mock_update = mocker.patch.object(self.review_object, "update")

            # Call the method
            self.manager.update_review(self.instance, self.user, **kwargs)

            # Assert the expected behavior
            mock_update.assert_called_once_with(**kwargs)

    @pytest.mark.parametrize("review_exists", (True, False))
    def test_remove_review(self, mocker, review_exists):
        review_by_user = self.review_object if review_exists else None

        # Mock main dependencies
        mocker.patch.object(UserReviewManager, "get_review_by_user", return_value=review_by_user)

        if not review_exists:
            # Assert the expected behavior
            with pytest.raises(NotFound):
                self.manager.remove_review(self.instance, self.user)

        else:
            # Mock dependencies
            mock_delete = mocker.patch.object(self.review_object, "delete")

            # Call the method
            self.manager.remove_review(self.instance, self.user)

            # Assert the expected behavior
            mock_delete.assert_called_once_with()


class TestUserReviewManager:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.manager = UserReview.objects
        self.user = mocker.MagicMock(spec=User)
        self.instance = mocker.MagicMock(spec=User)

    # TODO: Вернуться к этому тесту после того как будет реализован метод `can_review`

    # @pytest.mark.parametrize("instance_match_model", (SellerProfile, Product))
    # def test_can_review(self, mocker, instance_match_model):
    #     instance = mocker.MagicMock(spec=instance_match_model)
    #
    #     # Mock manager QuerySet
    #     mock_queryset = mocker.MagicMock(spec=QuerySet)
    #     mocker.patch.object(models.Manager, "filter", return_value=mock_queryset)
    #
    #     # Call the method
    #     with pytest.raises(ValidationError):
    #         mock_queryset.exists.return_value = False
    #         self.manager.can_review(instance, self.user)
    #
    #     mock_queryset.exists.return_value = True
    #     self.manager.can_review(instance, self.user)

    def test_get_reviews(self, mocker):
        # Mock dependencies
        mock_ct = mocker.patch.object(ContentTypeManager, "get_for_model", return_value=mocker.MagicMock())
        mock_filter = mocker.patch.object(self.manager, "filter", return_value=mocker.MagicMock())

        # Call the method
        result = self.manager.get_reviews(self.instance)

        # Assert the expected behavior
        mock_ct.assert_called_once_with(self.instance)
        mock_filter.assert_called_once_with(
            review__content_type=mock_ct.return_value,
            review__object_id=self.instance.pk,
        )
        assert result == mock_filter.return_value

    @pytest.mark.parametrize("reviews_exists", (True, False))
    def test_get_review_by_user(self, mocker, reviews_exists):
        expected_value = reviews_exists if reviews_exists else None

        # Mock QuerySet
        mock_queryset = mocker.MagicMock(spec=QuerySet)
        mock_queryset.filter.return_value = mock_queryset
        mock_queryset.first.return_value = expected_value

        # Mock `get_reviews` method
        mock_get_reviews = mocker.patch.object(self.manager, "get_reviews", return_value=mock_queryset)

        # Call the method
        result = self.manager.get_review_by_user(self.instance, self.user)

        # Assert the expected behavior
        mock_get_reviews.assert_called_once_with(self.instance)
        mock_queryset.filter.assert_called_once_with(user=self.user)
        mock_queryset.first.assert_called_once_with()

        assert result == expected_value
