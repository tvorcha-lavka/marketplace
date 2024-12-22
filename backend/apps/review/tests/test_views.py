from collections import namedtuple as nt

import pytest
from django.contrib.contenttypes.models import ContentType, ContentTypeManager
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated

from apps.review.models import UserReview
from apps.review.models.manager import UserReviewManager
from apps.review.views import RateAndReviewAPIView
from core.conftest import deep_check

from .conftest import UserSchema

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
GET_LIST = nt("Review", ["review", "expected_status", "results_count"])
POST = nt("Review", ["review", "expected_status", "expected_data"])
PATCH = nt("Review", ["review", "expected_status", "expected_data"])
DELETE = nt("Review", ["review", "expected_status", "expected_data"])


# ----- Test Cases -----------------------------------------------------------------------------------------------------
get_list_test_cases = [
    GET_LIST("with_existing_review", status.HTTP_200_OK, 1),
    GET_LIST(None, status.HTTP_200_OK, 0),
]
post_test_cases = [
    POST("with_existing_review", status.HTTP_400_BAD_REQUEST, ["detail"]),
    POST(None, status.HTTP_201_CREATED, ["user", "score", "message"]),
]
patch_test_cases = [
    POST("with_existing_review", status.HTTP_200_OK, ["user", "score", "message"]),
    POST(None, status.HTTP_404_NOT_FOUND, ["detail"]),
]
delete_test_cases = [
    DELETE("with_existing_review", status.HTTP_204_NO_CONTENT, None),
    DELETE(None, status.HTTP_404_NOT_FOUND, ["detail"]),
]


@pytest.mark.django_db
class TestRateAndReviewAPIView:
    @pytest.fixture(autouse=True)
    def setup(self, mocker, auth_client, users, test_route_for_review):
        mocker.patch.object(UserReviewManager, "can_review", return_value=True)

        self.users: UserSchema = users
        self.from_user = self.users.user1
        self.to_user = self.users.user2

        self.api_view = RateAndReviewAPIView()
        self.client = auth_client(self.from_user)
        self.url = f"/api/test-route/{self.to_user.pk}/reviews/"

    def test_get_permissions(self):
        default_permission_classes = [IsAuthenticated]
        expected_permission_classes_map = {
            "list": [AllowAny],
            "create": [IsAuthenticated],
            "partial_update": [IsAuthenticated],
            "destroy": [IsAuthenticated],
        }

        for action, permission_classes in expected_permission_classes_map.items():
            # Set view permissions to default permission classes
            self.api_view.permission_classes = default_permission_classes

            # Set the action to api_view
            self.api_view.action = action

            # Call the method to update permission_classes
            self.api_view.get_permissions()

            # Assert the expected behavior
            assert self.api_view.permission_classes == permission_classes

    @pytest.mark.parametrize("content_type", (None, True))
    def test_get_content_type(self, mocker, content_type):
        self.api_view.content_type = content_type

        if not content_type:
            # Expect the method raise an `NotImplementedError` exception
            with pytest.raises(NotImplementedError):
                self.api_view.get_content_type()

        else:  # Expect the method not to raise an exception
            mocker.patch.object(ContentTypeManager, "get_for_model")
            self.api_view.get_content_type()

    @pytest.mark.parametrize("rise_exception", (False, True))
    def test_get_object(self, mocker, rise_exception):
        self.api_view.kwargs = {"pk": self.to_user.pk}

        mock_content_type = mocker.MagicMock(spec=ContentType)
        side_effect = ObjectDoesNotExist if rise_exception else None
        mock_content_type.get_object_for_this_type.side_effect = side_effect
        mocker.patch.object(self.api_view, "get_content_type", return_value=mock_content_type)

        if rise_exception:
            # Expect the method raise an `NotFound` exception
            with pytest.raises(NotFound):
                self.api_view.get_object()

        else:  # Expect the method not to raise an exception
            obj = self.api_view.get_object()
            assert obj is not None

    @pytest.mark.parametrize("test_case", get_list_test_cases)
    def test_list_reviews(self, request, test_case: GET_LIST):
        # Prepare test data
        cache.clear()

        if test_case.review:  # dynamically fixture
            request.getfixturevalue(test_case.review)

        # Make the request
        response = self.client.get(self.url)

        # Assert the expected behavior
        assert response.status_code == test_case.expected_status
        assert response.data.get("count") == test_case.results_count

    @pytest.mark.parametrize("test_case", post_test_cases)
    def test_create_review(self, request, test_case: POST):
        # Prepare test data
        data = {"score": 4, "message": "Nice!"}

        if test_case.review:  # dynamically fixture
            request.getfixturevalue(test_case.review)

        # Make the request
        response = self.client.post(self.url, data)

        # Assert the expected behavior
        assert response.status_code == test_case.expected_status
        assert deep_check(response.data, test_case.expected_data)

        if not test_case.review:
            # Check that the review has been created
            created_data = UserReview.objects.get_review_by_user(self.to_user, self.from_user)

            assert created_data.review.content_object == self.to_user
            assert created_data.user == self.from_user
            assert created_data.score == data.get("score")
            assert created_data.message == data.get("message")

    @pytest.mark.parametrize("test_case", patch_test_cases)
    def test_update_review(self, request, test_case: PATCH):
        # Prepare test data
        data = {"score": 3, "message": "Updated review!"}

        if test_case.review:  # dynamically fixture
            request.getfixturevalue(test_case.review)

        # Make the request
        response = self.client.patch(self.url, data)

        # Assert the expected behavior
        assert response.status_code == test_case.expected_status
        assert deep_check(response.data, test_case.expected_data)

        if test_case.review:
            # Check that the review has been updated
            updated_review = UserReview.objects.get_review_by_user(self.to_user, self.from_user)

            assert updated_review.score == data.get("score")
            assert updated_review.message == data.get("message")

    @pytest.mark.parametrize("test_case", delete_test_cases)
    def test_delete_review(self, request, test_case: DELETE):
        # Prepare test data
        if test_case.review:  # dynamically fixture
            request.getfixturevalue(test_case.review)

        # Make the request
        response = self.client.delete(self.url)

        # Assert the expected behavior
        assert response.status_code == test_case.expected_status
        assert deep_check(response.data, test_case.expected_data)

        if test_case.review:
            # Check that the review has been deleted
            assert not UserReview.objects.get_review_by_user(self.to_user, self.from_user)
