from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_page
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

from core.cache import clear_view_cache

from .models import Review, UserReview
from .serializers import RatingWithReviewSerializer


class RateAndReviewAPIView(ModelViewSet):
    serializer_class = RatingWithReviewSerializer
    content_type = None

    @classmethod
    def as_view(cls, **kwargs):
        actions = {"get": "list", "post": "create", "patch": "partial_update", "delete": "destroy"}
        return super().as_view(actions=actions, **kwargs)

    def get_permissions(self):
        if self.action == "list":
            self.permission_classes = [AllowAny]
        return [permission() for permission in self.permission_classes]

    def get_content_type(self):
        if not self.content_type:
            raise NotImplementedError("You must define `content_type` in the subclass.")
        return ContentType.objects.get_for_model(self.content_type)

    def get_queryset(self):
        return UserReview.objects.get_reviews(self.get_object())

    def get_object(self):
        try:
            content_type = self.get_content_type()
            object_id = self.kwargs.get(self.lookup_field)
            return content_type.get_object_for_this_type(pk=object_id)

        except ObjectDoesNotExist:
            raise NotFound(_("No %s matches the given query.") % self.content_type.__name__)

    @method_decorator(cache_page(600, key_prefix="user-reviews"))  # server-side cache for 10 min
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @clear_view_cache(key_prefix="user-reviews")
    def perform_create(self, serializer):
        data = Review.objects.make_review(self.get_object(), self.request.user, **serializer.validated_data)
        serializer._data = self.get_serializer(data).data

    @clear_view_cache(key_prefix="user-reviews")
    def perform_update(self, serializer):
        data = Review.objects.update_review(self.get_object(), self.request.user, **serializer.validated_data)
        serializer._data = self.get_serializer(data).data

    @clear_view_cache(key_prefix="user-reviews")
    def perform_destroy(self, instance):
        Review.objects.remove_review(instance, self.request.user)
