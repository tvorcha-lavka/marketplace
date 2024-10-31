import pytest
from django.db.models import QuerySet

from apps.category.admin import CategoryCardAdminForm
from apps.category.models import Card, Category


class TestCategoryCardAdminForm:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.mock_qs = mocker.MagicMock(spec=QuerySet)
        self.mocked_category_qs = mocker.patch.object(Category.objects, "filter", return_value=self.mock_qs)

    @pytest.mark.parametrize("test_with_card, expected_category_id", ((True, 1), (False, 2)))
    def test_init_form(self, test_with_card, expected_category_id):
        # Create category instance
        category_1 = Category(id=1, title="Test Category 1")
        category_2 = Category(id=2, title="Test Category 2")
        card = Card(id=1, category=category_1)

        # Mock queryset
        category_queryset = [category_1] if test_with_card else [category_2]
        self.mock_qs.prefetch_related.return_value.all.return_value = category_queryset

        # Form initialization
        form = CategoryCardAdminForm(instance=card if test_with_card else None)

        # Check that the filtering call was correct
        self.mocked_category_qs.assert_called_once_with(**{"pk": card.pk} if test_with_card else {"card": None})

        # Check that the correct queryset has been assigned
        category_qs = form.fields["category"].queryset
        assert category_qs == category_queryset
        assert category_qs[0].pk == expected_category_id
