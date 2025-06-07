from unittest.mock import patch

import pytest
from django.urls import path
from pytest_django import DjangoDbBlocker

from apps.review.models import Review, UserReview
from apps.review.models.manager import UserReviewManager
from apps.review.views import RateAndReviewAPIView
from apps.user.models import User
from core.tests.fixtures import *  # noqa: F401, F403
from core.tests.typing import UsersTuple

__all__ = [
    "with_existing_review",
    "test_route_for_review",
]


@pytest.fixture
def with_existing_review(django_db_blocker: DjangoDbBlocker, users: UsersTuple) -> UserReview:  # noqa: F811
    with django_db_blocker.unblock(), patch.object(UserReviewManager, "can_review", return_value=True):
        return Review.objects.make_review(instance=users.user2, user=users.user1, score=5, message="Great!")


@pytest.fixture(scope="class")
def test_route_for_review() -> None:
    from core import urls

    RateAndReviewAPIView.content_type = User

    urls.urlpatterns += [
        path("api/test-route/<uuid:pk>/reviews/", RateAndReviewAPIView.as_view(), name="test-review-route"),
    ]
