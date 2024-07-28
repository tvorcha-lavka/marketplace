import os

from django.conf import settings

settings.AUTHENTICATION_BACKENDS += [
    "social_core.backends.facebook.FacebookOAuth2",
]

settings.SOCIAL_AUTH_FACEBOOK_KEY = os.getenv("FACEBOOK_APP_ID")
settings.SOCIAL_AUTH_FACEBOOK_SECRET = os.getenv("FACEBOOK_APP_SECRET")
settings.FACEBOOK_OAUTH2_REDIRECT_URI = os.getenv("FACEBOOK_OAUTH2_REDIRECT_URI")
settings.FACEBOOK_OAUTH2_SERVICE_NAME = "facebook"

settings.SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
    "fields": "id, name, email",
}
