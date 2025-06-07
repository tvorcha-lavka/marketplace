from datetime import timedelta
from typing import Any

from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.tokens import BlacklistMixin
from rest_framework_simplejwt.tokens import RefreshToken as BaseRefreshToken
from rest_framework_simplejwt.utils import datetime_from_epoch

from apps.user.models import User


class RefreshToken(BaseRefreshToken):

    @classmethod
    def for_user_x(cls, user: User, attrs: dict[str, Any]) -> "RefreshToken":
        """
        Adds this token to the outstanding token list.
        """
        refresh = super(BlacklistMixin, cls).for_user(user)
        access = refresh.access_token  # noqa

        if remember_me := attrs["remember_me"]:
            refresh.set_exp(lifetime=timedelta(days=30))

        payload = {
            "language": user.language,
            "remember_me": remember_me,
        }

        refresh.payload.update(payload)
        access.payload.update(payload)

        OutstandingToken.objects.create(
            user=user,
            jti=refresh[api_settings.JTI_CLAIM],
            token=str(refresh),
            created_at=refresh.current_time,
            expires_at=datetime_from_epoch(refresh["exp"]),
        )

        return refresh  # noqa
