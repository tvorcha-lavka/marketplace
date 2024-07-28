import os

from django.conf import settings

settings.AUTHENTICATION_BACKENDS += [
    "social_core.backends.google.GoogleOAuth2",
]

settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.getenv("GOOGLE_OAUTH2_KEY")
settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv("GOOGLE_OAUTH2_SECRET")
settings.GOOGLE_OAUTH2_REDIRECT_URI = os.getenv("GOOGLE_OAUTH2_REDIRECT_URI")
settings.GOOGLE_OAUTH2_SERVICE_NAME = "google-oauth2"
