from collections import namedtuple as nt
from typing import TypeAlias

import pytest
from django.urls import reverse
from rest_framework import status

from apps.email.choices import EmailType
from apps.user_auth.models import VerificationCode
from core.tests.typing import APIClient, AuthClientType, CodeFactoryTuple, UsersTuple

# ----- VerifyCodeAPIView Test Case Schema -----------------------------------------------------------------------------
V_TestCase = nt("V_TestCase", ["auth_user", "code", "expected_status", "expected_data"])
CaseType: TypeAlias = V_TestCase

# ----- VerifyCodeAPIView Test Cases -----------------------------------------------------------------------------------
verify_code_test_cases = [
    # "auth_user", "code", "expected_status", "expected_data"
    V_TestCase("user1", "valid_code", status.HTTP_200_OK, ["email", "message"]),
    V_TestCase("user1", "invalid_code", status.HTTP_400_BAD_REQUEST, ["detail"]),
    V_TestCase("user1", "expired_code", status.HTTP_400_BAD_REQUEST, ["detail"]),
]


# ----- VerifyCodeAPIView Tests ----------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestVerifyCodeAPIView:
    @pytest.fixture(autouse=True)
    def setup(
        self,
        code_factory: CodeFactoryTuple,
        auth_client: AuthClientType,
        users: UsersTuple,
    ) -> None:
        self.code_factory = code_factory
        self.auth_client = auth_client
        self.users = users

    @pytest.mark.parametrize("test_case", verify_code_test_cases)
    def test_verify_email_view(self, test_case: V_TestCase) -> None:
        user = self.users.user1
        code_obj = self.code_factory.create(user.email, EmailType.PASSWORD_RECOVERY)

        if test_case.code == "invalid_code":
            self.code_factory.make_invalid(code_obj)
        elif test_case.code == "expired_code":
            self.code_factory.make_expired(code_obj)

        url = reverse("verify-code")
        data = {"email": user.email, "code": int(code_obj)}
        client = self.get_testcase_client(test_case)
        response = client.post(url, data=data)

        if response.status_code == status.HTTP_200_OK:
            assert VerificationCode.objects.filter(id=code_obj.id).exists()

        assert response.status_code == test_case.expected_status
        for key in test_case.expected_data:
            assert key in response.data

    # ----- Helper Methods ---------------------------------------------------------------------------------------------
    def get_testcase_client(self, test_case: CaseType) -> APIClient:
        return self.auth_client(getattr(self.users, test_case.auth_user))
