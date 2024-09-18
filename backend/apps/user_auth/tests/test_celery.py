from collections import namedtuple
from unittest.mock import patch

import pytest

from apps.user.models import User as UserModel
from apps.user_auth.models import CodeType, VerificationCode
from apps.user_auth.tasks import delete_non_used_code, delete_non_verified_user

# ----- Test Case Schemas ----------------------------------------------------------------------------------------------
User = namedtuple("VerifiedUserTestCaseSchema", ["user", "is_email_verified"])
Code = namedtuple("ExpiredCodeTestCaseSchema", ["assigned_user", "is_expired"])


# ----- Test Cases -----------------------------------------------------------------------------------------------------
delete_non_verified_user_test_case = [
    # "user", "is_email_verified"
    User("user1", True),
    User("user1", False),
]
delete_non_used_code_test_case = [
    # "assigned_user", "is_expired"
    Code("user1", True),
    Code("user1", False),
]


# ----- Test Delete Non Verified User ----------------------------------------------------------------------------------
@pytest.mark.django_db
@pytest.mark.parametrize("test_case", delete_non_verified_user_test_case)
def test_delete_non_verified_user(users, test_case: User):
    user = getattr(users, test_case.user)
    user.is_email_verified = test_case.is_email_verified
    user.save()

    result = delete_non_verified_user.apply_async((user.id,), queue="low_priority", priority=0)
    result.wait()

    query = UserModel.objects.filter(id=user.id)
    assert query.exists() if user.is_email_verified else not query.exists()


@pytest.mark.django_db
@pytest.mark.parametrize("test_case", delete_non_used_code_test_case)
@patch("apps.user_auth.signals.current_app.control.revoke", name="revoke_celery_task")
def test_delete_non_used_code(mock_revoke_task, users, code_factory, test_case: Code):
    user = getattr(users, test_case.assigned_user)
    code_obj = code_factory.create(user, CodeType.RESET_PASSWORD)
    code_factory.make_expired(code_obj) if test_case.is_expired else None

    result = delete_non_used_code.apply_async((code_obj.id,), queue="low_priority", priority=0)
    result.wait()

    query = VerificationCode.objects.filter(user=user)

    if test_case.is_expired:
        mock_revoke_task.assert_called_once()
        assert not query.exists()
    else:
        mock_revoke_task.assert_not_called()
        assert query.exists()
