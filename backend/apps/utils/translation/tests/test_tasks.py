import pytest
from deep_translator import DeeplTranslator
from django.conf import settings
from parler.models import TranslatableModelMixin

from apps.utils.translation.tasks import redis_client, translate_fields_task
from apps.utils.translation.tests.conftest import DummyModel


class TestTranslateTask:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        instance_name = "Test Model"
        self.translated_name = f"Translated {instance_name}"
        self.instance = DummyModel(id=1, name=instance_name)

        self.mock_get_obj = mocker.patch.object(DummyModel.objects, "get", return_value=self.instance)
        self.mock_translate = mocker.patch.object(DeeplTranslator, "translate", return_value=self.translated_name)
        self.mock_create_translation = mocker.patch.object(
            TranslatableModelMixin,
            "create_translation",
            return_value=None,
        )

    def test_translate_fields_task_with_unlocked_redis(self, mocker):
        # Mock Redis client methods
        mock_redis_setnx = mocker.patch.object(redis_client, "setnx", return_value=True)
        mock_redis_expire = mocker.patch.object(redis_client, "expire", return_value=True)
        mock_redis_delete = mocker.patch.object(redis_client, "delete", return_value=True)

        translate_fields_task.apply_async(
            args=(self.instance._meta.label, self.instance.pk, self.instance.language_code),  # type: ignore
            queue="high_priority",
            priority=10,
        )

        # Check Redis lock methods
        lock_key = f"translate_task_lock_{self.instance.pk}"

        # Check if the Redis lock was set and expired
        mock_redis_setnx.assert_called_once_with(lock_key, "locked")
        mock_redis_expire.assert_called_once_with(lock_key, 60)

        # Check if the Redis lock was deleted after processing
        mock_redis_delete.assert_called_once_with(lock_key)

        # Check that the `get` method has been called once
        self.mock_get_obj.assert_called_once_with(pk=self.instance.pk)

        # Get a language list
        languages = [code for (code, lang) in settings.LANGUAGES if code != self.instance.language_code]

        # Check that the `translate` method has been called with instance name
        expected_calls = [mocker.call(self.instance.name) for _ in range(len(languages))]  # type: ignore
        self.mock_translate.assert_has_calls(expected_calls, any_order=False)
        assert self.mock_translate.call_count == len(expected_calls)

        # Check that the `create_translation` method has been called with available languages
        expected_calls = [mocker.call(lang, name=self.translated_name) for lang in languages]
        self.mock_create_translation.assert_has_calls(expected_calls, any_order=False)
        assert self.mock_create_translation.call_count == len(expected_calls)

    def test_translate_fields_task_with_locked_redis(self, mocker):
        # Mock Redis client to simulate locked redis (setnx returns False)
        mock_redis_setnx = mocker.patch.object(redis_client, "setnx", return_value=False)
        mock_redis_expire = mocker.patch.object(redis_client, "expire")
        mock_redis_delete = mocker.patch.object(redis_client, "delete")

        # Run the task
        translate_fields_task.apply_async(
            args=(self.instance._meta.label, self.instance.pk, self.instance.language_code),  # type: ignore
            queue="high_priority",
            priority=10,
        )

        # Check that the `setnx` method has been called and returned False
        lock_key = f"translate_task_lock_{self.instance.pk}"
        mock_redis_setnx.assert_called_once_with(lock_key, "locked")

        # Ensure that `expire` and `delete` were never called because the lock was not acquired
        mock_redis_expire.assert_not_called()
        mock_redis_delete.assert_not_called()

        # Ensure that no translation methods were called, since the lock was not acquired
        self.mock_get_obj.assert_not_called()
        self.mock_create_translation.assert_not_called()
        self.mock_translate.assert_not_called()
