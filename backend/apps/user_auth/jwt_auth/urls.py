from django.urls import path
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import SignupAPIView

SignupAPIView = extend_schema(tags=["Sign-Up"])(SignupAPIView)
TokenObtainPairView = extend_schema(tags=["JWT Authentication"])(TokenObtainPairView)
TokenRefreshView = extend_schema(tags=["JWT Authentication"])(TokenRefreshView)

urlpatterns = [
    path("sign-up/", SignupAPIView.as_view(), name="sign-up"),
    path("token/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
