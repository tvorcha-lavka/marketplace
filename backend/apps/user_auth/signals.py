from celery import current_app
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import VerificationCode
from .tasks import remove_unused_code


@receiver(post_save, sender=VerificationCode)
def delete_unused_code(sender, instance, **kwargs):  # noqa: F841
    """This signal creates a task to delete the unused code after 10 minutes."""
    task = remove_unused_code.apply_async((instance.id,), countdown=600, queue="low_priority", priority=0)
    sender.objects.filter(id=instance.id).update(uuid=task.id)


@receiver(post_delete, sender=VerificationCode)
def revoke_delete_unused_code(sender, instance, **kwargs):  # noqa: F841
    """This signal revokes a Celery task to delete the unused code."""
    current_app.control.revoke(task_id=str(instance.uuid), terminate=True)
