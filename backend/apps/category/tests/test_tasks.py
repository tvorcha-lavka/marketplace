import pytest

from apps.category.models import Statistics
from apps.category.tasks import update_category_purchase, update_category_views


class TestUpdateCategoryTasks:

    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        mocker.patch.object(Statistics, "increment_views")
        mocker.patch.object(Statistics, "increment_purchases")

        self.mock_instance = mocker.MagicMock(spec=Statistics)
        mocker.patch.object(Statistics.objects, "get_or_create", return_value=(self.mock_instance, True))

    def test_update_category_views(self):
        # Completing the task
        result = update_category_views(1)

        # Check that `increment_views` has been called
        self.mock_instance.increment_views.assert_called_once()

        # Check the result of the task
        assert result == f"Category ID: 1, Views count: {int(self.mock_instance.views_count * 1000)}"

    def test_update_category_purchase(self):
        # Completing the task
        result = update_category_purchase(1)

        # Check that `increment_purchases` has been called
        self.mock_instance.increment_purchases.assert_called_once()

        # Check the result of the task
        assert result == f"Category ID: 1, Purchases count: {int(self.mock_instance.purchases_count * 1000)}"
