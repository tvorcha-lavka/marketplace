import os
from datetime import timedelta

from .base import *  # noqa: F403

DEBUG = True

ALLOWED_HOSTS += ["localhost", "127.0.0.1"] + eval(os.getenv("ALLOWED_DEV_HOSTS"))  # noqa: F405

SIMPLE_JWT.update(  # noqa: F405
    {
        "ACCESS_TOKEN_LIFETIME": timedelta(days=7),
        "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    }
)
