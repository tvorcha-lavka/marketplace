from celery import shared_task

from apps.user.models import User
from apps.user_auth.models import VerificationCode


@shared_task
def delete_non_verified_user(user_id: int):
    user = User.objects.get(id=user_id)
    if not user.is_email_verified:
        user.delete()


@shared_task
def delete_non_used_code(code_id: int):
    code = VerificationCode.objects.get(id=code_id)
    if code.is_expired():
        code.delete()
