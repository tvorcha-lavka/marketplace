from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.user_auth.jwt_auth.tasks import delete_non_verified_user
from apps.user_auth.models import VerificationCode


@receiver(post_save, sender=VerificationCode)
def schedule_user_deletion(sender, instance, **kwargs):  # noqa: F841
    task = delete_non_verified_user.apply_async((instance.user.id,), countdown=600, queue="low_priority", priority=0)
    sender.objects.filter(id=instance.id).update(uuid=task.id)
