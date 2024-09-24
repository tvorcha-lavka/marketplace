from collections import namedtuple as nt

import pytest
from django.urls import reverse
from rest_framework import status

from apps.user_auth.models import EmailType, VerificationCode

# ----- VerifyCodeAPIView Test Case Schema -----------------------------------------------------------------------------
V_TestCase = nt("VerifyCode", ["auth_user", "code", "expected_status", "expected_data"])

# ----- VerifyCodeAPIView Test Cases ----------------------------------------------------------------------------------
verify_code_test_cases = [
    # "auth_user", "code", "expected_status", "expected_data"
    V_TestCase("admin", "valid_code", status.HTTP_200_OK, ["email", "message"]),
    V_TestCase("admin", "invalid_code", status.HTTP_400_BAD_REQUEST, ["detail"]),
    V_TestCase("admin", "expired_code", status.HTTP_400_BAD_REQUEST, ["detail"]),
    V_TestCase("user1", "valid_code", status.HTTP_403_FORBIDDEN, ["detail"]),
]


# ----- VerifyCodeAPIView Tests ---------------------------------------------------------------------------------------
@pytest.mark.django_db
class TestVerifyCodeAPIView:
    @pytest.fixture(autouse=True)
    def inject_fixtures(self, auth_client, users, code_factory):
        self.auth_client = auth_client
        self.users = users
        self.code_factory = code_factory

    @pytest.mark.parametrize("test_case", verify_code_test_cases)
    def test_verify_email_view(self, test_case: V_TestCase):
        user = self.users.user1
        code_obj = self.code_factory.create(user.email, EmailType.RESET_PASSWORD)

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
    def get_testcase_client(self, test_case):
        return self.auth_client(getattr(self.users, test_case.auth_user))
