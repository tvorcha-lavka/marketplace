from typing import Any

from apps.user.models import User as UserModel

from .typing import UsersTuple


def deep_check(data: list[Any] | dict[str, Any], keys: list[str] | tuple[str]) -> bool:
    """Checks that all keys from keys are present somewhere in data, including nested dictionaries."""
    if not data and not keys:
        return True

    if isinstance(data, dict):
        return all(key in data or any(deep_check(value, [key]) for value in data.values()) for key in keys)

    elif isinstance(data, list):
        return all(deep_check(item, keys) for item in data)

    # This should be unreachable, but just in case:
    raise AssertionError(f"Unexpected type for data: {type(data)}")


def create_users() -> UsersTuple:
    extra_fields = {"first_name": "John", "last_name": "Doe"}
    admin = UserModel.objects.create_superuser("admin", "admin@gmail.com", "TestPassword123", **extra_fields)
    user1 = UserModel.objects.create_user("user1", "user1@gmail.com", "TestPassword123", **extra_fields)
    user2 = UserModel.objects.create_user("user2", "user2@gmail.com", "TestPassword123", **extra_fields)
    return UsersTuple(None, admin, user1, user2)


def get_users() -> UsersTuple:
    usernames = ["admin", "user1", "user2"]
    users_list = list(UserModel.objects.filter(username__in=usernames))
    return UsersTuple(None, *users_list)
