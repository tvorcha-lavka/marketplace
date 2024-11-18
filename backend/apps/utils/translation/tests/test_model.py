import time

import pytest
from deep_translator import DeeplTranslator
from django.conf import settings
from django.db import transaction
from parler.models import TranslatableModelMixin

from apps.utils.translation.tasks import translate_fields_task

from .conftest import DummyModel


class TestAutoTranslatableModel:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.instance_name = "Test Model"
        self.instance = DummyModel(name=self.instance_name)

        self.translated_name = f"Translated {self.instance_name}"
        self.mock_translate = mocker.patch.object(DeeplTranslator, "translate", return_value=self.translated_name)

        self.mock_set_translated_fields = mocker.patch.object(
            self.instance, "_set_translated_fields", side_effect=self.instance._set_translated_fields
        )
        self.mock_save_translation = mocker.patch.object(TranslatableModelMixin, "save_translation")

    def test_save(self, mocker):
        # Mock methods in `save` methods
        mock_save = mocker.patch.object(TranslatableModelMixin, "save")
        mock_on_commit = mocker.patch.object(transaction, "on_commit")

        # Save instance
        self.instance.save()

        # Check that methods are called
        mock_save.assert_called_once()
        mock_on_commit.assert_called_once_with(self.instance.add_translate_task)

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
        # Translating a specific field
        self.instance.translate_field("name", self.instance_name)

        # Get a language list
        languages = [code for (code, lang) in settings.LANGUAGES if code != self.instance.language_code]

        # Check that the `translate` method has been called with instance name
        expected_calls = [mocker.call(self.instance_name) for _ in range(len(languages))]
        self.mock_translate.assert_has_calls(expected_calls, any_order=False)
        assert self.mock_translate.call_count == len(expected_calls)

        # Check that the `_set_translated_fields` method has been called with available languages
        expected_calls = [mocker.call(lang, name=self.translated_name.capitalize()) for lang in languages]
        self.mock_set_translated_fields.assert_has_calls(expected_calls, any_order=False)
        assert self.mock_set_translated_fields.call_count == len(expected_calls)

        # Check that the `save_translation` method has been called the correct number of times
        assert self.mock_save_translation.call_count == len(expected_calls)

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

    def test_list_formatting(self, mocker):
        # Creating linked models
        model_1 = DummyModel(name="Test Model 1")
        model_2 = DummyModel(name="Test Model 2")
        model_3 = DummyModel(name="Test Model 3")

        # Mock the `values` field in the instance
        mock_values = mocker.patch.object(DummyModel, "values")
        mock_values.all.return_value = [model_1, model_2, model_3]

        # Call `list_formatting` method
        result = self.instance.list_formatting(field="name", related_field="values")

        # Check the result
        expected_result = "Test Model 1, Test Model 2, Test Model 3"
        assert result == expected_result
