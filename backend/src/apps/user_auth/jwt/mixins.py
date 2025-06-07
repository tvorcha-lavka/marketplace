from rest_framework_simplejwt.tokens import RefreshToken

from apps.user.models import User


class TokenMixin:
    @staticmethod
    def get_token_pair(user: User) -> dict[str, str]:
        token_pair = RefreshToken.for_user(user)
        return {
            "refresh": str(token_pair),
            "access": str(token_pair.access_token),
        }
