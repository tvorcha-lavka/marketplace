from typing import TYPE_CHECKING, Any

from django.contrib.contenttypes.models import ContentType
from django.db.models import Manager, Model, QuerySet
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import NotFound, ValidationError

if TYPE_CHECKING:  # pragma: no cover
    from apps.user.models import User

    from .review import Review, UserReview  # noqa: F401


class ReviewManager(Manager["Review"]):
    def check_instance(self, instance: Model, method_name: str) -> None:
        if isinstance(instance, self.model):
            raise TypeError("`%s` method expects model to be reviewed, not Review model." % method_name)

    def make_review(self, instance: Model, user: "User", score: int, message: str = "") -> "UserReview":
        from .review import UserReview

        self.check_instance(instance, "make_review")
        UserReview.objects.can_review(instance, user)

        if UserReview.objects.get_review_by_user(instance, user):
            raise ValidationError({"detail": _("User review already exists.")})

        ct = ContentType.objects.get_for_model(instance)
        review, created = self.get_or_create(content_type=ct, object_id=instance.pk)
        return UserReview.objects.create(user=user, score=score, message=message, review=review)

    def update_review(self, instance: Model, user: "User", **kwargs: Any) -> "UserReview":
        from .review import UserReview

        self.check_instance(instance, "update_review")

        if review := UserReview.objects.get_review_by_user(instance, user):
            return review.update(**kwargs)

        raise NotFound(_("There are no reviews from %s") % user.username)

    def remove_review(self, instance: Model, user: "User") -> tuple[int, dict[str, int]]:
        from .review import UserReview

        self.check_instance(instance, "remove_review")

        if review := UserReview.objects.get_review_by_user(instance, user):
            return review.delete()

        raise NotFound(_("There are no reviews from %s") % user.username)


class UserReviewManager(Manager["UserReview"]):
    @staticmethod
    def can_review(instance: Model, user: "User") -> None:
        # TODO: Вернуться к этой проверке после того как будет реализована модель `SellerProfile` и `Order`

        # from apps.user.models import SellerProfile
        # from apps.product.models import Product
        # from apps.order.models import Order

        # if isinstance(instance, SellerProfile):
        #     if not Order.objects.filter(user=user, seller=instance).exists():
        #         message = _("You can't leave a review for this seller without having bought from them.")
        #         raise ValidationError({"detail": message})

        # elif isinstance(instance, Product):
        #     if not Order.objects.filter(user=user, items__product=instance).exists():
        #         message = _("You can't leave a review for this product without buying it.")
        #         raise ValidationError({"detail": message})

        pass

    def get_reviews(self, instance: Model) -> QuerySet["UserReview"]:
        content_type = ContentType.objects.get_for_model(instance)
        queryset: QuerySet["UserReview"] = self.filter(
            review__content_type=content_type,
            review__object_id=instance.pk,
        )
        return queryset

    def get_review_by_user(self, instance: Model, user: "User") -> "UserReview | None":
        return self.get_reviews(instance).filter(user=user).first()
