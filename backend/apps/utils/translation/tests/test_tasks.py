import pytest

from apps.utils.translation.tasks import redis_client, translate_fields_task
from apps.utils.translation.tests.conftest import DummyModel


class TestTranslateTask:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.instance = DummyModel(id=1, name="Test Model")
        self.model_label = self.instance._meta.label  # type: ignore
        self.mock_get_obj = mocker.patch.object(DummyModel.objects, "get", return_value=self.instance)
        self.translate_field = mocker.patch.object(self.instance, "translate_field")

    def test_translate_fields_task_with_unlocked_redis(self, mocker):
        # Mock Redis client methods
        mock_redis_setnx = mocker.patch.object(redis_client, "setnx", return_value=True)
        mock_redis_expire = mocker.patch.object(redis_client, "expire", return_value=True)
        mock_redis_delete = mocker.patch.object(redis_client, "delete", return_value=True)

        translate_fields_task.apply_async(
            args=(self.model_label, self.instance.pk, self.instance.language_code),
            queue="high_priority",
            priority=10,
        )

        # Check Redis lock methods
        lock_key = f"translate_task_lock_{self.model_label}:{self.instance.pk}"

        # Check if the Redis lock was set and expired
        mock_redis_setnx.assert_called_once_with(lock_key, "locked")
        mock_redis_expire.assert_called_once_with(lock_key, 60)

        # Check if the Redis lock was deleted after processing
        mock_redis_delete.assert_called_once_with(lock_key)

        # Check that the `get` method has been called once
        self.mock_get_obj.assert_called_once_with(pk=self.instance.pk)

        expected_calls = [
            mocker.call(field, getattr(self.instance, field)) for field in self.instance.get_translated_fields()
        ]
        self.translate_field.assert_has_calls(expected_calls, any_order=False)
        assert self.translate_field.call_count == len(expected_calls)

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
        lock_key = f"translate_task_lock_{self.model_label}:{self.instance.pk}"
        mock_redis_setnx.assert_called_once_with(lock_key, "locked")

        # Ensure that `expire` and `delete` were never called because the lock was not acquired
        mock_redis_expire.assert_not_called()
        mock_redis_delete.assert_not_called()

        # Ensure that no translation methods were called, since the lock was not acquired
        self.mock_get_obj.assert_not_called()
