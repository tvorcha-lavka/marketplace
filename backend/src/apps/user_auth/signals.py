from typing import Any

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from core.celery.client import app
from core.celery.enums import QueueEnum

from .models import VerificationCode as Code
from .tasks import prune_unused_verification_code_task


@receiver(post_save, sender=Code)
def delete_unused_code(sender: Code, instance: Code, **kwargs: Any) -> None:  # noqa: F841
    """This signal creates a task to delete the unused code after 10 minutes."""
    task = prune_unused_verification_code_task.apply_async(
        args=(instance.id,),
        countdown=600,
        queue=QueueEnum.DATABASE,
        priority=0,
    )
    sender.objects.filter(id=instance.id).update(uuid=task.id)


@receiver(post_delete, sender=Code)
def revoke_delete_unused_code(sender: Code, instance: Code, **kwargs: Any) -> None:  # noqa: F841
    """This signal revokes a Celery task to delete the unused code."""
    app.control.revoke(task_id=str(instance.uuid), terminate=True)
