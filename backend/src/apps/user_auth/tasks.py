from celery import Task

from apps.user_auth.models import VerificationCode
from core.celery.client import app
from core.celery.enums import QueueEnum


@app.task(name="database.prune.unused.verification-code", queue=QueueEnum.DATABASE, bind=True)
def prune_unused_verification_code_task(self: Task, code_id: int) -> None:
    try:
        code = VerificationCode.objects.get(id=code_id)
        if code.is_expired():
            code.delete()
    except Exception as e:
        raise self.retry(exc=e)
