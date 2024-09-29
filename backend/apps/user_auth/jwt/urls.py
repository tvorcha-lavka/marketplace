from django.urls import path
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import LoginAPIView, LogoutAPIView, SignupAPIView, SignupCompleteAPIView

SchemaTag = "JWT Authentication"
LoginAPIView = extend_schema(tags=[SchemaTag], auth=[])(LoginAPIView)
LogoutAPIView = extend_schema(tags=[SchemaTag], auth=[])(LogoutAPIView)
SignupAPIView = extend_schema(tags=[SchemaTag], auth=[])(SignupAPIView)
SignupCompleteAPIView = extend_schema(tags=[SchemaTag], auth=[])(SignupCompleteAPIView)

SchemaTag = "JWT Token Obtain Pair"
TokenObtainPairView = extend_schema(tags=[SchemaTag])(TokenObtainPairView)
TokenRefreshView = extend_schema(tags=[SchemaTag])(TokenRefreshView)

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("sign-up/", SignupAPIView.as_view(), name="sign-up"),
    path("sign-up/complete/", SignupCompleteAPIView.as_view(), name="sign-up-complete"),
    # ----------------------------------------------------------------------------
    path("token/obtain/", TokenObtainPairView.as_view(), name="token-obtain"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
