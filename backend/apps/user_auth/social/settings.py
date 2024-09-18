from django.conf import settings

settings.INSTALLED_APPS += [
    "social_django",
    "apps.user_auth.social.facebook",
    "apps.user_auth.social.google",
]

settings.AUTHENTICATION_BACKENDS += [
    "social_core.backends.facebook.FacebookOAuth2",
    "social_core.backends.google.GoogleOAuth2",
]

settings.SOCIAL_AUTH_SESSION_COOKIE = False
settings.SOCIAL_AUTH_REDIRECT_IS_HTTPS = True
settings.SOCIAL_AUTH_FORCE_POST_DISCONNECT = True


if settings.DEBUG:
    settings.SOCIAL_AUTH_REDIRECT_IS_HTTPS = False
