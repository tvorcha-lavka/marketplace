from django.urls import path
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.views import TokenBlacklistView

from .views import (
    LoginAPIView,
    SignupAPIView,
    SignupCompleteAPIView,
    TokenObtainPairView,
    TokenRefreshView,
)

SchemaTag = "JWT Authentication"
LoginAPIViewExtended = extend_schema(tags=[SchemaTag])(LoginAPIView)
LogoutAPIViewExtended = extend_schema(tags=[SchemaTag])(TokenBlacklistView)
SignupAPIViewExtended = extend_schema(tags=[SchemaTag])(SignupAPIView)
SignupCompleteAPIViewExtended = extend_schema(tags=[SchemaTag])(SignupCompleteAPIView)

SchemaTag = "JWT Token Obtain Pair"
TokenObtainPairViewExtended = extend_schema(tags=[SchemaTag])(TokenObtainPairView)
TokenRefreshViewExtended = extend_schema(tags=[SchemaTag])(TokenRefreshView)

urlpatterns = [
    path("login/", LoginAPIViewExtended.as_view(), name="login"),
    path("logout/", LogoutAPIViewExtended.as_view(), name="logout"),
    path("sign-up/", SignupAPIViewExtended.as_view(), name="sign-up"),
    path("sign-up/complete/", SignupCompleteAPIViewExtended.as_view(), name="sign-up-complete"),
    # ----------------------------------------------------------------------------
    path("token/obtain/", TokenObtainPairViewExtended.as_view(), name="token-obtain"),
    path("token/refresh/", TokenRefreshViewExtended.as_view(), name="token-refresh"),
]
