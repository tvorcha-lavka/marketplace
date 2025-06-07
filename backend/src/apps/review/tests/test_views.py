from collections import namedtuple as nt
from typing import Any, cast

import pytest
from _pytest.fixtures import FixtureRequest
from django.contrib.contenttypes.models import ContentType, ContentTypeManager
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from pytest_mock import MockFixture
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated

from apps.review.models import UserReview
from apps.review.models.manager import UserReviewManager
from apps.review.views import RateAndReviewAPIView
from apps.user.models import User
from core.tests.typing import AuthClientType, UsersTuple
from core.tests.utils import deep_check

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
GET_LIST = nt("GET_LIST", ["review", "expected_status", "results_count"])
POST = nt("POST", ["review", "expected_status", "expected_data"])
PATCH = nt("PATCH", ["review", "expected_status", "expected_data"])
DELETE = nt("DELETE", ["review", "expected_status", "expected_data"])


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
    def setup(
        self,
        mocker: MockFixture,
        auth_client: AuthClientType,
        users: UsersTuple,
        test_route_for_review: None,
    ) -> None:
        mocker.patch.object(UserReviewManager, "can_review", return_value=True)

        self.users = users
        self.from_user = self.users.user1
        self.to_user = self.users.user2

        self.api_view = RateAndReviewAPIView()
        self.client = auth_client(self.from_user)
        self.url = f"/api/test-route/{self.to_user.pk}/reviews/"

    def test_get_permissions(self) -> None:
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

    @pytest.mark.parametrize("content_type", (User, None))
    def test_get_content_type(self, mocker: MockFixture, content_type: ContentType) -> None:
        self.api_view.content_type = content_type

        if not content_type:
            # Expect the method to raise an `NotImplementedError` exception
            with pytest.raises(NotImplementedError):
                self.api_view.get_content_type()

        else:  # Expect the method not to raise an exception
            mocker.patch.object(ContentTypeManager, "get_for_model")
            self.api_view.get_content_type()

    @pytest.mark.parametrize("rise_exception", (False, True))
    def test_get_object(self, mocker: MockFixture, rise_exception: bool) -> None:
        self.api_view.kwargs = {"pk": self.to_user.pk}

        mock_content_type = mocker.MagicMock(spec=ContentType)
        side_effect = ObjectDoesNotExist if rise_exception else None
        mock_content_type.get_object_for_this_type.side_effect = side_effect
        mocker.patch.object(self.api_view, "get_content_type", return_value=mock_content_type)

        if rise_exception:
            # Expect the method to raise an `NotFound` exception
            with pytest.raises(NotFound):
                self.api_view.get_object()

        else:  # Expect the method not to raise an exception
            obj = self.api_view.get_object()
            assert obj is not None

    @pytest.mark.parametrize("test_case", get_list_test_cases)
    def test_list_reviews(self, request: FixtureRequest, test_case: GET_LIST) -> None:
        # Prepare test data
        cache.clear()

        if test_case.review:  # dynamically fixture
            request.getfixturevalue(test_case.review)

        # Make the request
        response = self.client.get(self.url)
        response_data = cast(dict[str, Any], response.data)

        # Assert the expected behavior
        assert response.status_code == test_case.expected_status
        assert response_data.get("count", -1) == test_case.results_count

    @pytest.mark.parametrize("test_case", post_test_cases)
    def test_create_review(self, request: FixtureRequest, test_case: POST) -> None:
        # Prepare test data
        data = {"score": 4, "message": "Nice!"}

        if test_case.review:  # dynamically fixture
            request.getfixturevalue(test_case.review)

        # Make the request
        response = self.client.post(self.url, data)
        response_data = cast(dict[str, Any], response.data)

        # Assert the expected behavior
        assert response.status_code == test_case.expected_status
        assert deep_check(response_data, test_case.expected_data)

        if not test_case.review:
            # Check that the review has been created
            created_data = UserReview.objects.get_review_by_user(self.to_user, self.from_user)

            assert created_data is not None
            assert created_data.review.content_object == self.to_user
            assert created_data.user == self.from_user
            assert created_data.score == data.get("score")
            assert created_data.message == data.get("message")

    @pytest.mark.parametrize("test_case", patch_test_cases)
    def test_update_review(self, request: FixtureRequest, test_case: PATCH) -> None:
        # Prepare test data
        data = {"score": 3, "message": "Updated review!"}

        if test_case.review:  # dynamically fixture
            request.getfixturevalue(test_case.review)

        # Make the request
        response = self.client.patch(self.url, data)
        data = cast(dict[str, Any], response.data)

        # Assert the expected behavior
        assert response.status_code == test_case.expected_status
        assert deep_check(data, test_case.expected_data)

        if test_case.review:
            # Check that the review has been updated
            updated_review = UserReview.objects.get_review_by_user(self.to_user, self.from_user)

            assert updated_review is not None
            assert updated_review.score == data.get("score")
            assert updated_review.message == data.get("message")

    @pytest.mark.parametrize("test_case", delete_test_cases)
    def test_delete_review(self, request: FixtureRequest, test_case: DELETE) -> None:
        # Prepare test data
        if test_case.review:  # dynamically fixture
            request.getfixturevalue(test_case.review)

        # Make the request
        response = self.client.delete(self.url)
        data = cast(dict[str, Any], response.data)

        # Assert the expected behavior
        assert response.status_code == test_case.expected_status
        assert deep_check(data, test_case.expected_data)

        if test_case.review:
            # Check that the review has been deleted
            assert not UserReview.objects.get_review_by_user(self.to_user, self.from_user)
