from typing import TYPE_CHECKING, Optional

from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import NotFound, ValidationError

if TYPE_CHECKING:  # pragma: no cover
    from apps.user.models import User

    from .review import UserReview


class ReviewManager(models.Manager):
    def check_instance(self, instance: models.Model, method_name: str):
        if isinstance(instance, self.model):
            raise TypeError("`%s` method expects model to be reviewed, not Review model." % method_name)

    def make_review(self, instance: models.Model, user: "User", score: int, message: Optional[str] = None):
        from .review import UserReview

        self.check_instance(instance, "make_review")
        UserReview.objects.can_review(instance, user)

        if UserReview.objects.get_review_by_user(instance, user):
            raise ValidationError({"detail": _("User review already exists.")})

        ct = ContentType.objects.get_for_model(instance)
        review, created = self.get_or_create(content_type=ct, object_id=instance.pk)
        return UserReview.objects.create(user=user, score=score, message=message, review=review)

    def update_review(self, instance: models.Model, user: "User", **kwargs):
        from .review import UserReview

        self.check_instance(instance, "update_review")

        if review := UserReview.objects.get_review_by_user(instance, user):
            return review.update(**kwargs)

        raise NotFound(_("There are no reviews from %s") % user.username)

    def remove_review(self, instance: models.Model, user: "User"):
        from .review import UserReview

        self.check_instance(instance, "remove_review")

        if review := UserReview.objects.get_review_by_user(instance, user):
            return review.delete()

        raise NotFound(_("There are no reviews from %s") % user.username)


class UserReviewManager(models.Manager):
    @staticmethod
    def can_review(instance: models.Model, user: "User") -> None:
        # TODO: Вернуться к этой проверке после того как будет реализована модель `SellerProfile` и `Order`

        # from apps.user.models import SellerProfile
        # from apps.product.models import Product
        # from apps.order.models import Order

        # if isinstance(instance, SellerProfile):
        #     if not Order.objects.filter(user=user, seller=instance).exists():
        #         raise ValidationError(_("You can't leave a review for this seller without having bought from them."))

        # elif isinstance(instance, Product):
        #     if not Order.objects.filter(user=user, items__product=instance).exists():
        #         raise ValidationError(_("You can't leave a review for this product without buying it."))

        pass

    def get_reviews(self, instance: models.Model) -> models.QuerySet["UserReview"]:
        ct = ContentType.objects.get_for_model(instance)
        return self.filter(review__content_type=ct, review__object_id=instance.pk)

    def get_review_by_user(self, instance: models.Model, user: "User") -> Optional["UserReview"]:
        return self.get_reviews(instance).filter(user=user).first()
