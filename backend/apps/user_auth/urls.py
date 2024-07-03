from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import SignupAPIView

urlpatterns = [
    path("sign-up/", SignupAPIView.as_view(), name="sign-up"),
    path("sign-in/", TokenObtainPairView.as_view(), name="sign-in"),
    path("token-refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
