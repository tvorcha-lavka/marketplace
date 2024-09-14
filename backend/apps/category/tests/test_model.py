import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.category.models import Category, CategoryImage, TitlePosition


@pytest.mark.django_db
class TestCategoryModel:
    @pytest.mark.usefixtures("migrate_categories")
    def test_str_method(self):
        category = Category.objects.first()
        assert str(category) == category.name

    def test_save_method(self, mock_translator):
        initial_category_count = Category.objects.count()
        mock_translator_instance = mock_translator.return_value

        # --------------------------------------------------------------------
        return_translation_1 = "Clothing"
        mock_translator_instance.translate.return_value = return_translation_1
        parent = Category(title="Одяг", order=1)
        parent.save()

        return_translation_2 = "Female"
        mock_translator_instance.translate.return_value = return_translation_2
        children = Category(title="Жіночий", order=1, parent=parent)
        children.save()

        assert Category.objects.count() == initial_category_count + 2
        assert parent.get_translation("en").title == return_translation_1
        assert children.get_translation("en").title == return_translation_2

        # --------------------------------------------------------------------
        new_parent_title = "Взуття"
        return_translation_3 = "Footwear"
        mock_translator_instance.translate.return_value = return_translation_3
        parent.title = new_parent_title
        parent.save()
        assert parent.get_translation("en").title == return_translation_3

        # --------------------------------------------------------------------
        new_parent_name = "footwear-new"
        parent.name = new_parent_name
        parent.save()
        children.refresh_from_db()

        assert children.href == parent.href + f"/{children.name}"


@pytest.mark.django_db
@pytest.mark.usefixtures("migrate_categories", "cleanup_media")
class TestImageModel:
    def test_str_method(self):
        category = Category.objects.first()
        test_image = CategoryImage.objects.create(
            image=SimpleUploadedFile(name="test_image.jpg", content=b"", content_type="image/jpeg"),
            title_position=TitlePosition.TOP_LEFT,
            category=category,
        )
        assert str(test_image) == f"Image {test_image.pk} - {test_image.title_position}"
