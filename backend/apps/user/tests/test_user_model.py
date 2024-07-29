import pytest


@pytest.mark.django_db
class TestUserModel:
    def test_str_method(self, users):
        user = users.user1
        assert str(user) == user.get_full_name()
