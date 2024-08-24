from .base import *

DEBUG = True

ALLOWED_HOSTS += ["localhost", "127.0.0.1"] + eval(os.getenv("ALLOWED_DEV_HOSTS"))

INSTALLED_APPS += [
    "silk",
]

MIDDLEWARE += [
    "silk.middleware.SilkyMiddleware",
]

BASE_FRONTEND_URL = os.getenv("DEV_FRONTEND_URL")
