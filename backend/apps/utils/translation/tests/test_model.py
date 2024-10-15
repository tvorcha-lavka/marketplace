import pytest
from deep_translator import DeeplTranslator
from django.utils.text import slugify
from parler.models import TranslatableModelMixin

from apps.utils.translation.tasks import translate_fields_task

from .conftest import DummyModel, NoImplementedDummyModel


@pytest.mark.django_db
class TestAutoTranslatableModel:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.instance_name = "Test Model"
        self.translated_name = f"Translated {self.instance_name}"

        self.instance = DummyModel(name=self.instance_name)
        self.mock_mixin_1 = mocker.patch.object(TranslatableModelMixin, "save", return_value=None)
        self.mock_mixin_2 = mocker.patch.object(TranslatableModelMixin, "create_translation", return_value=None)

        self.mock_task = mocker.patch.object(translate_fields_task, "apply_async")
        self.mock_translate = mocker.patch.object(DeeplTranslator, "translate", return_value=self.translated_name)

    def test_str_method(self):
        assert str(self.instance) == self.instance_name

    @pytest.mark.django_db(transaction=True)
    def test_save(self):
        self.instance.save()

        # Check that the slug was generated correctly
        assert self.instance.slug == slugify(self.translated_name)

        # Check that the translation task has been started
        self.mock_task.assert_called_once_with(
            args=(self.instance._meta.label, self.instance.pk),  # type: ignore
            queue="high_priority",
            priority=10,
        )

    def test_field_for_slug_implementation(self):
        # Check that the `field_for_slug` rise NotImplementedError
        with pytest.raises(NotImplementedError):
            NoImplementedDummyModel().field_for_slug()

    def test_field_for_slug(self):
        # Check that the `field_for_slug` method returns the expected value
        assert self.instance.field_for_slug() == "name"

    def test_generate_slug(self):
        self.instance.name = "Slug Test"
        self.instance.generate_slug()

        # Check that the slug was generated correctly
        assert self.instance.slug == slugify(self.translated_name)

    def test_add_translate_task(self):
        self.instance.add_translate_task()

        # Check that the translation task was called with the correct arguments
        self.mock_task.assert_called_once_with(
            args=(self.instance._meta.label, self.instance.pk),  # type: ignore
            queue="high_priority",
            priority=10,
        )

    def test_translate(self):
        translated_value = self.instance.translate("Test String")

        # Check that the `translate` method has been called
        self.mock_translate.assert_called_once_with("Test String")

        # Check the result of the translation
        assert translated_value == self.translated_name

    def test_get_translated_fields(self):
        translated_fields = self.instance.get_translated_fields()

        # Check that the `get_translated_fields` method returns a list of fields
        assert translated_fields == ["name"]

    def test_translate_field(self):
        # Translating a specific field
        self.instance.translate_field("name", "Test Name")

        # Check that the `translate` method has been called
        self.mock_translate.assert_called()
