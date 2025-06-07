from json import dumps, loads
from typing import Any, cast

from django.contrib.auth.hashers import make_password
from django.core.cache import cache


def save_temporary_signup_data(email: str, data: dict[str, Any]) -> None:
    key = f"signup_data:{email}"

    data_to_save = {
        "email": email,
        "username": email.split("@")[0],
        "password": make_password(data["password"]),
    }

    data_json = dumps(data_to_save)
    cache.set(key, data_json, timeout=600)


def temporary_signup_data_is_exists(email: str) -> bool:
    key = f"signup_data:{email}"
    data = cache.get(key)
    return bool(data)


def temporary_signup_data_update_timeout(email: str) -> None:
    key = f"signup_data:{email}"

    if temporary_signup_data_is_exists(email):
        data = cache.get(key)
        cache.set(key, data, timeout=600)


def get_temporary_signup_data(email: str) -> dict[str, Any]:
    key = f"signup_data:{email}"
    data_json = cache.get(key)
    cache.delete(key)
    return cast(dict[str, Any], loads(data_json or "{}"))
