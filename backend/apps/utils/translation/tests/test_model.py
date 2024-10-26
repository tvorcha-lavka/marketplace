import time

import pytest
from deep_translator import DeeplTranslator
from django.db import transaction
from django.utils.text import slugify
from parler.models import TranslatableModelMixin

from apps.utils.translation.tasks import translate_fields_task

from .conftest import DummyModel, NoImplementedDummyModel


class TestAutoTranslatableModel:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.instance_name = "Test Model"
        self.instance = DummyModel(name=self.instance_name)

        self.translated_name = f"Translated {self.instance_name}"
        self.mock_translate = mocker.patch.object(DeeplTranslator, "translate", return_value=self.translated_name)

    def test_str_method(self):
        assert str(self.instance) == self.instance_name

    def test_save(self, mocker):
        # Mock methods in `save` methods
        mock_save = mocker.patch.object(TranslatableModelMixin, "save")
        mock_generate_slug = mocker.patch.object(self.instance, "generate_slug")
        mock_on_commit = mocker.patch.object(transaction, "on_commit")

        # Save instance
        self.instance.save()

        # Check that methods are called
        mock_save.assert_called_once()
        mock_generate_slug.assert_called_once()
        mock_on_commit.assert_called_once_with(self.instance.add_translate_task)

    def test_field_for_slug_implementation(self):
        # Check that the `field_for_slug` rise NotImplementedError
        with pytest.raises(NotImplementedError):
            NoImplementedDummyModel().field_for_slug()

    def test_field_for_slug(self):
        # Check that the `field_for_slug` method returns the expected value
        assert self.instance.field_for_slug() == "name"

    def test_generate_slug(self, mocker):
        name = "Slug Test"
        return_translation = f"Translated {name}"
        mocker.patch.object(DeeplTranslator, "translate", return_value=return_translation)

        self.instance.name = name
        self.instance.generate_slug()

        # Check that the slug was generated correctly
        assert self.instance.slug == slugify(return_translation)

    def test_add_translate_task(self, mocker):
        # Mock `apply_async` method
        mock_task = mocker.patch.object(translate_fields_task, "apply_async")

        # Call `add_translate_task` method
        self.instance.add_translate_task()

        # Check that the translation task was called with the correct arguments
        mock_task.assert_called_once_with(
            args=(self.instance._meta.label, self.instance.pk, self.instance.language_code),  # type: ignore
            queue="high_priority",
            priority=10,
        )

    def test_get_translated_fields(self):
        translated_fields = self.instance.get_translated_fields()

        # Check that the `get_translated_fields` method returns a list of fields
        assert translated_fields == ["name"]

    def test_translate_field(self, mocker):
        # Mock `create_translation` method
        mocker.patch.object(TranslatableModelMixin, "create_translation")

        # Translating a specific field
        self.instance.translate_field("name", "Test Name")

        # Check that the `translate` method has been called
        self.mock_translate.assert_called()

    def test_translate(self, mocker):
        # Mock `translate` method in DeeplTranslator
        mock_translate = mocker.patch.object(DeeplTranslator, "translate")
        value = "Test String"

        # Call `translate` method
        self.instance.translate(value)

        # Check that the `translate` method has been called
        mock_translate.assert_called_once_with(value)

    def test_translate_with_connection_error(self, mocker):
        mocker.patch.object(time, "sleep", return_value=None)
        mock_translate = mocker.patch.object(
            DeeplTranslator, "translate", side_effect=ConnectionError("Failed to connect")
        )

        with pytest.raises(ConnectionError) as exc_info:
            self.instance.translate("Test String", self.instance.language_code)

        # Check that the error contains the correct message
        assert str(exc_info.value) == (
            "Unsuccessful translation for class (%s). Instance id: (%s). Language code: (%s). "
            "Failed to connect to the translation service after several attempts."
            % (self.instance.__class__.__name__, self.instance.pk, self.instance.language_code)
        )

        # Check that the `translate` method has tried to translate message 5 times
        assert mock_translate.call_count == 5
