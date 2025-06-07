from typing import TYPE_CHECKING, Any, cast

from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Model, QuerySet
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_page
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer
from rest_framework.viewsets import ModelViewSet

from apps.user.models import User
from core.cache import clear_view_cache

from .models import Review, UserReview
from .serializers import RatingWithReviewSerializer

if TYPE_CHECKING:  # pragma: no cover
    from rest_framework.decorators import ViewSetAction  # noqa: F401
    from rest_framework.permissions import _SupportsHasPermission
    from rest_framework.views import AsView, GenericView


class RateAndReviewAPIView(ModelViewSet[UserReview]):
    serializer_class = RatingWithReviewSerializer
    content_type: type[Model] | Model

    @classmethod
    def as_view(
        cls,
        actions: "dict[str, str | ViewSetAction[Any]] | None" = None,
        **initkwargs: Any,
    ) -> "AsView[GenericView]":
        actions = {
            "get": "list",
            "post": "create",
            "patch": "partial_update",
            "delete": "destroy",
        }
        return super().as_view(actions=actions, **initkwargs)

    def get_permissions(self) -> list["_SupportsHasPermission"]:
        if self.action == "list":
            self.permission_classes = [AllowAny]
        return [permission() for permission in self.permission_classes]

    def get_content_type(self) -> ContentType:
        if not self.content_type:
            raise NotImplementedError("You must define `content_type` in the subclass.")
        return ContentType.objects.get_for_model(self.content_type)

    def get_queryset(self) -> QuerySet[UserReview]:
        return UserReview.objects.get_reviews(self.get_object())

    def get_object(self) -> Model:  # type: ignore[override]
        try:
            content_type = self.get_content_type()
            object_id = self.kwargs.get(self.lookup_field)
            return content_type.get_object_for_this_type(pk=object_id)

        except ObjectDoesNotExist:
            arg = cast(type, self.content_type).__name__
            raise NotFound(_("No %s matches the given query.") % arg)

    def perform_authentication(self, request: Request) -> None:
        if request.user.is_anonymous:
            raise PermissionDenied()

    @method_decorator(cache_page(600, key_prefix="user-reviews"))  # server-side cache for 10 min
    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        return super().list(request, *args, **kwargs)

    @clear_view_cache(key_prefix="user-reviews")
    def perform_create(self, serializer: BaseSerializer[UserReview]) -> None:
        assert isinstance(self.request.user, User)
        data = Review.objects.make_review(self.get_object(), self.request.user, **serializer.validated_data)
        serializer._data = self.get_serializer(data).data  # type: ignore[attr-defined]

    @clear_view_cache(key_prefix="user-reviews")
    def perform_update(self, serializer: BaseSerializer[UserReview]) -> None:
        assert isinstance(self.request.user, User)
        data = Review.objects.update_review(self.get_object(), self.request.user, **serializer.validated_data)
        serializer._data = self.get_serializer(data).data  # type: ignore[attr-defined]

    @clear_view_cache(key_prefix="user-reviews")
    def perform_destroy(self, instance: Model) -> None:
        assert isinstance(self.request.user, User)
        Review.objects.remove_review(instance, self.request.user)
