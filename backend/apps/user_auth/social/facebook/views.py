from django.conf import settings

from apps.user_auth.social.views import SocialOAuth2CallbackView, SocialOAuth2RedirectView


class FacebookOAuth2RedirectView(SocialOAuth2RedirectView):
    redirect_uri = settings.FACEBOOK_OAUTH2_REDIRECT_URI
    service_name = settings.FACEBOOK_OAUTH2_SERVICE_NAME


class FacebookOAuth2CallbackView(SocialOAuth2CallbackView):
    redirect_uri = settings.FACEBOOK_OAUTH2_REDIRECT_URI
    service_name = settings.FACEBOOK_OAUTH2_SERVICE_NAME
