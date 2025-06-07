from celery import Task

from apps.user_auth.models import VerificationCode
from core.celery.client import app


@app.task(name="database.prune.unused.verification-code", queue="database.queue", bind=True)  # type: ignore[misc]
def prune_unused_verification_code_task(self: Task, code_id: int) -> None:
    try:
        code = VerificationCode.objects.get(id=code_id)
        if code.is_expired():
            code.delete()
    except Exception as e:
        raise self.retry(exc=e)
