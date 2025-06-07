from celery import Task
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from core.celery.client import app


@app.task(name="database.prune.expired.tokens", queue="database.queue", bind=True)  # type: ignore[misc]
def prune_expired_tokens_task(self: Task) -> None:
    try:
        # Removing expired tokens from BlacklistedToken
        blacklisted_expired_tokens = BlacklistedToken.objects.filter(token__expires_at__lte=timezone.now())
        blacklisted_expired_tokens.delete()

        # Removing expired tokens from OutstandingToken
        outstanding_expired_tokens = OutstandingToken.objects.filter(expires_at__lte=timezone.now())
        outstanding_expired_tokens.delete()

    except Exception as e:
        raise self.retry(exc=e)
