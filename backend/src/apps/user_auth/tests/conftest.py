from datetime import timedelta
from random import randint
from unittest.mock import MagicMock, patch
from uuid import uuid4

import pytest
from django.utils import timezone

from apps.email.choices import EmailType
from apps.user_auth.models import VerificationCode
from core.tests.fixtures import *  # noqa: F401, F403
from core.tests.typing import CodeFactoryTuple

__all__ = [
    "code_factory",
]


@pytest.fixture
def code_factory() -> CodeFactoryTuple:

    @patch("apps.user_auth.signals.prune_unused_verification_code_task.apply_async", name="prune_task")
    def _create(email: str, email_type: EmailType, mock_prune_task: MagicMock) -> VerificationCode:
        mock_prune_task.return_value.id = uuid4()
        return VerificationCode.objects.create(email=email, email_type=email_type)

    def _make_invalid(code_obj: VerificationCode) -> None:
        VerificationCode.objects.filter(id=code_obj.pk).update(code=randint(100000, 999999))

    def _make_expired(code_obj: VerificationCode) -> None:
        VerificationCode.objects.filter(id=code_obj.pk).update(expires_at=timezone.now() - timedelta(minutes=15))

    return CodeFactoryTuple(create=_create, make_invalid=_make_invalid, make_expired=_make_expired)
