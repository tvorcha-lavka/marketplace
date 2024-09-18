from celery import shared_task
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken


@shared_task
def remove_expired_tokens():
    # Removing expired tokens from BlacklistedToken
    blacklisted_expired_tokens = BlacklistedToken.objects.filter(token__expires_at__lte=timezone.now())  # type: ignore
    blacklisted_expired_tokens.delete()

    # Removing expired tokens from OutstandingToken
    outstanding_expired_tokens = OutstandingToken.objects.filter(expires_at__lte=timezone.now())  # type: ignore
    outstanding_expired_tokens.delete()
