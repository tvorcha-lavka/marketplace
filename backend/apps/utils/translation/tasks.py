from celery import shared_task
from django.apps import apps


@shared_task
def translate_fields_task(app_label: str, instance_pk: int):
    """Create translations to each field in translatable_fields."""
    model = apps.get_model(app_label)
    instance = model.objects.get(pk=instance_pk)

    for field_name in instance.get_translated_fields():
        field_value = getattr(instance, field_name)

        instance.translate_field(field_name, field_value) if field_value else None
