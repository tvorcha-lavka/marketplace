from celery import shared_task

from apps.user_auth.models import VerificationCode


@shared_task
def remove_unused_code(code_id: int):
    code = VerificationCode.objects.get(id=code_id)
    if code.is_expired():
        code.delete()
