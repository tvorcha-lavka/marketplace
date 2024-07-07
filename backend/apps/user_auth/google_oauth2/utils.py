import requests
from django.conf import settings
from rest_framework.exceptions import ValidationError
from rest_framework.reverse import reverse

from apps.user.models import User


class GoogleOAuth2Service:
    USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"
    TOKEN_OBTAIN_URL = "https://accounts.google.com/o/oauth2/token"

    def get_user(self, request) -> User:
        access_token = self.get_access_token(request)
        user_data = self.get_user_data(access_token)

        try:
            user = User.objects.get(email=user_data["email"])
        except User.DoesNotExist:  # noqa
            user = User.objects.create(
                email=user_data["email"],
                username=user_data["email"].split("@")[0],
                first_name=user_data.get("given_name", ""),
                last_name=user_data.get("family_name", ""),
            )
        return user

    def get_access_token(self, request) -> str:
        data = {
            "code": request.GET.get("code"),
            "client_id": settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
            "client_secret": settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
            "redirect_uri": request.build_absolute_uri(reverse("google-oauth2-complete")),
            "grant_type": "authorization_code",
        }
        try:
            response = requests.post(self.TOKEN_OBTAIN_URL, data=data)
            response.raise_for_status()
            access_token = response.json()["access_token"]
        except (requests.RequestException, KeyError) as e:
            raise ValidationError("Failed to obtain access token from Google.") from e

        return access_token

    def get_user_data(self, access_token) -> dict:
        try:
            response = requests.get(self.USER_INFO_URL, params={"access_token": access_token})
            response.raise_for_status()
            user_data = response.json()
        except requests.RequestException as e:
            raise ValidationError("Failed to obtain user info from Google.") from e

        return user_data
