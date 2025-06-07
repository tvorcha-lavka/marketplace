import os

from django.conf import settings

settings.EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
settings.EMAIL_HOST = "smtp.gmail.com"
settings.EMAIL_PORT = 587
settings.EMAIL_USE_TLS = True
settings.EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
settings.EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
settings.DEFAULT_FROM_EMAIL = settings.EMAIL_HOST_USER
