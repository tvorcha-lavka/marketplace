import pytest

from core.tests.typing import UsersTuple


@pytest.mark.django_db
class TestUserModel:
    def test_str_method(self, users: UsersTuple) -> None:
        user = users.user1
        assert str(user) == user.username
