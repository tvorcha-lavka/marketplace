from collections import namedtuple
from unittest.mock import MagicMock

import pytest

from apps.email.choices import EmailType
from apps.user_auth.models import VerificationCode
from apps.user_auth.tasks import prune_unused_verification_code_task
from core.celery.client import app
from core.celery.enums import QueueEnum
from core.tests.typing import CodeFactoryTuple, UsersTuple

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
Code = namedtuple("Code", ["assigned_user", "is_expired"])


# ----- Test Cases -----------------------------------------------------------------------------------------------------
delete_non_used_code_test_case = [
    # "assigned_user", "is_expired"
    Code("user1", True),
    Code("user1", False),
]


# ----- Test Remove Unused Code ----------------------------------------------------------------------------------------


@pytest.mark.django_db
@pytest.mark.parametrize("test_case", delete_non_used_code_test_case)
def test_prune_unused_verification_code_task(
    code_factory: CodeFactoryTuple,
    mocker: MagicMock,
    users: UsersTuple,
    test_case: Code,
) -> None:
    mock_revoke_task = mocker.patch.object(app.control, "revoke")

    user = getattr(users, test_case.assigned_user)
    code_obj = code_factory.create(user.email, EmailType.PASSWORD_RECOVERY)
    code_factory.make_expired(code_obj) if test_case.is_expired else None

    result = prune_unused_verification_code_task.apply_async(
        args=(code_obj.id,),
        queue=QueueEnum.DATABASE,
        priority=0,
    )
    result.wait()

    query = VerificationCode.objects.filter(email=user.email)

    if test_case.is_expired:
        mock_revoke_task.assert_called_once()
        assert not query.exists()
    else:
        mock_revoke_task.assert_not_called()
        assert query.exists()
