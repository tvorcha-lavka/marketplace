import pytest
from django.urls import reverse

from apps.category.middleware import CategoryStatisticMiddleware
from apps.category.signals import category_viewed


class TestMiddleware:

    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        # Init middleware
        self.middleware = CategoryStatisticMiddleware(lambda req: None)

        # Mock the `category_viewed` signal
        self.mock_signal = mocker.patch.object(category_viewed, "send")

    def test_middleware_for_category_detail_view(self, rf):
        # Creating a request using RequestFactory
        request = rf.get(reverse("category-detail", kwargs={"pk": 1}))

        # Run the request through middleware
        self.middleware(request)

        # Check that the signal has been called once with the correct arguments
        self.mock_signal.assert_called_once_with(sender=CategoryStatisticMiddleware, category_id=1)

    def test_middleware_for_another_view(self, rf):
        # Creating a request using RequestFactory
        request = rf.get(reverse("category-list"))

        # Run the request through middleware
        self.middleware(request)

        # Check that the signal not called
        self.mock_signal.assert_not_called()
