import uuid
from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from apps.user_auth.jwt.tasks import remove_expired_tokens
from core.conftest import UserSchema


@pytest.mark.django_db
def test_remove_expired_tokens(users: UserSchema):
    expires_at = timezone.now() - timedelta(days=1)

    def create_refresh_token(user):
        return OutstandingToken.objects.create(token=uuid.uuid4(), user=user, expires_at=expires_at)  # type: ignore

    def put_refresh_token_to_blacklist(token):
        BlacklistedToken.objects.create(token=token)  # type: ignore

    refresh_token = create_refresh_token(users.user1)
    put_refresh_token_to_blacklist(refresh_token)

    remove_expired_tokens.apply()

    assert not BlacklistedToken.objects.filter(id=refresh_token.id).exists()  # type: ignore
    assert not OutstandingToken.objects.filter(id=refresh_token.id).exists()  # type: ignore
