from deep_translator import DeeplTranslator
from parler.models import TranslatableModelMixin

from apps.utils.translation.tasks import translate_fields_task
from apps.utils.translation.tests.conftest import DummyModel


def test_translate_fields_task(mocker):
    instance_name = "Test Model"
    translated_name = f"Translated {instance_name}"

    instance = DummyModel(id=1, name=instance_name)

    mock_get_obj = mocker.patch.object(DummyModel.objects, "get", return_value=instance)
    mock_create_translation = mocker.patch.object(TranslatableModelMixin, "create_translation", return_value=None)
    mock_translate = mocker.patch.object(DeeplTranslator, "translate", return_value=translated_name)

    translate_fields_task.apply_async(
        args=(instance._meta.label, instance.pk),  # type: ignore
        queue="high_priority",
        priority=10,
    )

    # Check that the `get` method has been called once
    mock_get_obj.assert_called_once()

    # Check that the `create_translation` method has been called
    mock_create_translation.assert_called()

    # Check that the `translate` method has been called
    mock_translate.assert_called()
