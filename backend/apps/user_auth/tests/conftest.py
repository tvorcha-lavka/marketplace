import uuid
from collections import namedtuple
from datetime import timedelta
from random import randint
from unittest.mock import patch

import pytest
from django.utils import timezone

from apps.email.models import EmailType
from apps.user_auth.models import VerificationCode
from core.conftest import UserSchema, api_client, auth_client, users  # noqa: F401


@pytest.fixture
def code_factory():
    CodeFactory = namedtuple("CodeFactory", ["create", "make_invalid", "make_expired"])

    @patch("apps.user_auth.signals.remove_unused_code.apply_async", name="remove_unused_code")
    def _create(email: str, email_type: EmailType, mock_remove_unused_code):
        mock_remove_unused_code.return_value.id = uuid.uuid4()
        return VerificationCode.objects.create(email=email, email_type=email_type)

    def _make_invalid(code_obj: VerificationCode):
        VerificationCode.objects.filter(id=code_obj.pk).update(code=randint(100000, 999999))

    def _make_expired(code_obj: VerificationCode):
        VerificationCode.objects.filter(id=code_obj.pk).update(expires_at=timezone.now() - timedelta(minutes=15))

    return CodeFactory(create=_create, make_invalid=_make_invalid, make_expired=_make_expired)
