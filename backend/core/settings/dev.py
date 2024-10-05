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

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.ngrok-free\.app$",
]
