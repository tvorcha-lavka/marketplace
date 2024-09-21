from celery import current_app
from django.db.models.signals import pre_delete
from django.dispatch import receiver

from core.signals import email_verification_signal, reset_password_signal

from .models import VerificationCode
from .tasks import delete_non_used_code, delete_non_verified_user


@receiver(email_verification_signal, sender=VerificationCode)
def handle_email_verification(sender, instance, **kwargs):  # noqa: F841
    """This signal creates a task to delete an unverified user if they are not verified within 10 minutes."""
    task = delete_non_verified_user.apply_async((instance.user.id,), countdown=600, queue="low_priority", priority=0)
    sender.objects.filter(id=instance.id).update(uuid=task.id)


@receiver(reset_password_signal, sender=VerificationCode)
def handle_reset_password(sender, instance, **kwargs):  # noqa: F841
    """This signal creates a task to delete the unused code after 10 minutes."""
    task = delete_non_used_code.apply_async((instance.id,), countdown=600, queue="low_priority", priority=0)
    sender.objects.filter(id=instance.id).update(uuid=task.id)


@receiver(pre_delete, sender=VerificationCode)
def revoke_task(sender, instance, **kwargs):  # noqa: F841
    """This signal revokes a Celery task."""
    current_app.control.revoke(task_id=str(instance.uuid), terminate=True)
