from datetime import timedelta
from uuid import uuid4

import pytest
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from apps.user.models import User as UserModel
from apps.user_auth.jwt.tasks import prune_expired_tokens_task
from core.tests.typing import UsersTuple


@pytest.mark.django_db
def test_prune_expired_tokens_task(users: UsersTuple) -> None:
    expires_at = timezone.now() - timedelta(days=1)

    def create_refresh_token(user: UserModel) -> OutstandingToken:
        return OutstandingToken.objects.create(token=str(uuid4()), user=user, expires_at=expires_at)

    def put_refresh_token_to_blacklist(token: OutstandingToken) -> None:
        BlacklistedToken.objects.create(token=token)

    refresh_token = create_refresh_token(users.user1)
    put_refresh_token_to_blacklist(refresh_token)

    prune_expired_tokens_task.apply()

    assert not BlacklistedToken.objects.filter(id=refresh_token.id).exists()
    assert not OutstandingToken.objects.filter(id=refresh_token.id).exists()
