from collections import namedtuple
from unittest.mock import patch

import pytest

from apps.email.models import EmailType
from apps.user_auth.models import VerificationCode
from apps.user_auth.tasks import remove_unused_code

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
Code = namedtuple("ExpiredCodeTestCaseSchema", ["assigned_user", "is_expired"])


# ----- Test Cases -----------------------------------------------------------------------------------------------------
delete_non_used_code_test_case = [
    # "assigned_user", "is_expired"
    Code("user1", True),
    Code("user1", False),
]


# ----- Test Remove Unused Code ----------------------------------------------------------------------------------------


@pytest.mark.django_db
@pytest.mark.parametrize("test_case", delete_non_used_code_test_case)
@patch("apps.user_auth.signals.current_app.control.revoke", name="revoke_celery_task")
def test_remove_unused_code(mock_revoke_task, users, code_factory, test_case: Code):
    user = getattr(users, test_case.assigned_user)
    code_obj = code_factory.create(user.email, EmailType.RESET_PASSWORD)
    code_factory.make_expired(code_obj) if test_case.is_expired else None

    result = remove_unused_code.apply_async((code_obj.id,), queue="low_priority", priority=0)
    result.wait()

    query = VerificationCode.objects.filter(email=user.email)

    if test_case.is_expired:
        mock_revoke_task.assert_called_once()
        assert not query.exists()
    else:
        mock_revoke_task.assert_not_called()
        assert query.exists()
