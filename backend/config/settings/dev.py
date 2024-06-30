from .base import *  # noqa: F403

DEBUG = True

ALLOWED_HOSTS += ["localhost", "127.0.0.1"] + eval(os.getenv("ALLOWED_DEV_HOSTS"))  # noqa: F405
