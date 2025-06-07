from collections import namedtuple
from typing import Callable, TypeAlias

from rest_framework.test import APIClient

from apps.user.models import User as UserModel

__all__ = [
    "APIClient",
    "AuthClientType",
    "UsersTuple",
    "CodeFactoryTuple",
    "ValidOrInvalidUserDataType",
    "ValidOrInvalidDataTuple",
    "DataTypeTuple",
]

UsersTuple = namedtuple("UsersTuple", ["not_auth", "admin", "user1", "user2"])
CodeFactoryTuple = namedtuple("CodeFactoryTuple", ["create", "make_invalid", "make_expired"])
ValidOrInvalidDataTuple = namedtuple("ValidOrInvalidDataTuple", ["valid_data", "invalid_data"])
DataTypeTuple = namedtuple("DataTypeTuple", ["for_partial_update"])

AuthClientType: TypeAlias = Callable[[UserModel | None], APIClient]
ValidOrInvalidUserDataType: TypeAlias = dict[str, ValidOrInvalidDataTuple]
