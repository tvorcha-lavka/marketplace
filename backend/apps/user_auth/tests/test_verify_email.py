import uuid
from collections import namedtuple as nt
from datetime import timedelta
from unittest.mock import patch

import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from apps.user_auth.models import VerificationCode

# ----- VerifyEmailAPIView Test Case Schema ----------------------------------------------------------------------------
V_TestCase = nt("VerifyEmail", ["auth_user", "token", "expected_status", "expected_data"])

# ----- VerifyEmailAPIView Test Cases ----------------------------------------------------------------------------------
verify_email_test_cases = [
    # "auth_user", "token", "expected_status", "expected_data"
    V_TestCase("admin", "valid_code", status.HTTP_200_OK, ["user", "token"]),
    V_TestCase("admin", "invalid_code", status.HTTP_400_BAD_REQUEST, ["detail"]),
    V_TestCase("admin", "expired_code", status.HTTP_400_BAD_REQUEST, ["detail"]),
    V_TestCase("user1", "valid_code", status.HTTP_403_FORBIDDEN, ["detail"]),
]


# ----- VerifyEmailAPIView Tests ---------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestVerifyEmailAPIView:
    @pytest.fixture(autouse=True)
    def inject_fixtures(self, auth_client, users):
        self.auth_client = auth_client
        self.users = users

    @pytest.mark.parametrize("test_case", verify_email_test_cases)
    @patch("apps.user_auth.jwt_auth.views.current_app.control.revoke")
    @patch("apps.user_auth.signals.delete_non_verified_user.apply_async")
    def test_verify_email_view(self, mock_delete_non_verified_user, mock_revoke_task, test_case: V_TestCase):
        mock_task_id = uuid.uuid4()
        mock_delete_non_verified_user.return_value.id = mock_task_id
        code_obj = VerificationCode.objects.create(user=self.users.user1)

        if test_case.token == "invalid_code":
            code_obj.code = 123456
        elif test_case.token == "expired_code":
            VerificationCode.objects.filter(id=code_obj.id).update(expires_at=timezone.now() - timedelta(minutes=15))

        url = reverse("verify-email")
        data = {"email": self.users.user1.email, "code": int(code_obj)}
        client = self.get_testcase_client(test_case)
        response = client.post(url, data=data)

        mock_delete_non_verified_user.assert_called_once_with(
            (code_obj.user.id,), countdown=600, queue="low_priority", priority=0
        )

        if response.status_code == status.HTTP_200_OK:
            mock_revoke_task.assert_called_once_with(task_id=str(mock_task_id), terminate=True)

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case):
        return self.auth_client(getattr(self.users, test_case.auth_user))
