from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from apps.review.views import RateAndReviewAPIView

from .models import SellerProfile, User
from .permissions import IsOwnerOrAdmin
from .serializers import UserSerializer


class UserViewSet(ModelViewSet[User]):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = UserSerializer
    model = User

    def get_object(self) -> User:
        return get_object_or_404(self.model, pk=self.kwargs.get("pk"))


class SellerRateAndReviewAPIView(RateAndReviewAPIView):
    content_type = SellerProfile
