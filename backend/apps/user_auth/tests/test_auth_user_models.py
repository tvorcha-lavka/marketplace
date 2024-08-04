from datetime import timedelta

import pytest

from apps.user_auth.models import BaseToken, EmailVerificationToken, PasswordResetToken


@pytest.mark.django_db
class TestBaseToken:
    def test_str_method(self, users):
        token = PasswordResetToken.objects.create(user=users.user1)
        expected_str = f"PasswordResetToken - {token.token}"
        assert str(token) == expected_str

    def test_base_token_default_expiry_not_implemented(self):
        class TestBaseTokenSubclass(BaseToken):
            class Meta:
                abstract = False

        with pytest.raises(NotImplementedError) as exc_info:
            token = TestBaseTokenSubclass(user=None)
            token.default_expiry()

        assert str(exc_info.value) == "Subclasses must implement `default_expiry`"


@pytest.mark.django_db
class TestPasswordResetToken:
    def test_default_expiry(self, users):
        token = PasswordResetToken(user=users.user1)
        assert token.default_expiry() == timedelta(minutes=15)


@pytest.mark.django_db
class TestVerifyEmailToken:
    def test_default_expiry(self, users):
        token = EmailVerificationToken(user=users.user1)
        assert token.default_expiry() == timedelta(days=1)
