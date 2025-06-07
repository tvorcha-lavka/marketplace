from django.conf import settings

from apps.user_auth.social.views import SocialOAuth2CallbackView, SocialOAuth2RedirectView


class GoogleOAuth2RedirectView(SocialOAuth2RedirectView):
    redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
    service_name = settings.GOOGLE_OAUTH2_SERVICE_NAME


class GoogleOAuth2CallbackView(SocialOAuth2CallbackView):
    redirect_uri = settings.GOOGLE_OAUTH2_REDIRECT_URI
    service_name = settings.GOOGLE_OAUTH2_SERVICE_NAME
