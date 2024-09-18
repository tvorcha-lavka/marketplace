import uuid
from collections import namedtuple
from datetime import timedelta
from random import randint
from unittest.mock import patch

import pytest
from django.utils import timezone

from apps.user.models import User
from apps.user_auth.models import CodeType, VerificationCode
from core.conftest import UserSchema, api_client, auth_client, users  # noqa: F401


@pytest.fixture
def code_factory():
    CodeFactory = namedtuple("CodeFactory", ["create", "make_invalid", "make_expired"])

    @patch("apps.user_auth.signals.delete_non_used_code.apply_async", name="delete_non_used_code")
    @patch("apps.user_auth.signals.delete_non_verified_user.apply_async", name="delete_non_verified_user")
    def _create(user: User, code_type: CodeType, mock_signal_1, mock_signal_2):
        mock_signal_1.return_value.id = uuid.uuid4()
        mock_signal_2.return_value.id = uuid.uuid4()
        return VerificationCode.objects.create(user=user, code_type=code_type)

    def _make_invalid(code_obj: VerificationCode):
        VerificationCode.objects.filter(id=code_obj.pk).update(code=randint(100000, 999999))

    def _make_expired(code_obj: VerificationCode):
        VerificationCode.objects.filter(id=code_obj.pk).update(expires_at=timezone.now() - timedelta(minutes=15))

    return CodeFactory(create=_create, make_invalid=_make_invalid, make_expired=_make_expired)
