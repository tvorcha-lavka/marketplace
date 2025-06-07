from decimal import Decimal
from typing import Any, cast

from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel

from apps.utils.models import UUIDv7Model

from .manager import ReviewManager, UserReviewManager


class Review(UUIDv7Model):
    class Meta:
        db_table = "review"
        verbose_name = _("Review")
        verbose_name_plural = _("Reviews")
        constraints = [models.UniqueConstraint(fields=("content_type", "object_id"), name="unique_object_review")]

    object_id = models.UUIDField(null=True, blank=True)

    ratings_count = models.PositiveIntegerField(default=0)
    reviews_count = models.PositiveIntegerField(default=0)
    avg_rating = models.DecimalField(db_index=True, max_digits=4, decimal_places=3, default=Decimal(0.0))

    objects = ReviewManager()
    content_object = GenericForeignKey()
    content_type = models.ForeignKey(ContentType, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return (
            f"for '{self.content_object}'; "
            f"Ratings count: {self.ratings_count}; "
            f"Reviews count: {self.reviews_count}; "
            f"Average rating: {self.avg_rating:.1f}"
        )

    def calculate(self) -> None:
        # access to UserReview through related name `user_reviews`
        user_reviews = cast(models.QuerySet[UserReview], self.user_reviews)

        # count `user_reviews` records
        aggregates: dict[str, int | None] = user_reviews.aggregate(
            ratings_count=models.Count("score"),
            reviews_count=models.Count("message"),
            avg_rating=models.Avg("score"),
        )
        self.ratings_count = int(aggregates.get("ratings_count") or 0)
        self.reviews_count = int(aggregates.get("reviews_count") or 0)
        self.avg_rating = float(aggregates.get("avg_rating") or 0.0)
        self.save()


class UserReview(UUIDv7Model, TimeStampedModel):
    class Meta:
        db_table = "review_userreview"
        verbose_name = _("User review")
        verbose_name_plural = _("User reviews")
        constraints = [models.UniqueConstraint(fields=("user", "review"), name="unique_user_review")]
        ordering = ["-created"]

    score = models.PositiveSmallIntegerField()
    message = models.TextField(_("message"), null=True, blank=True, max_length=500)

    objects = UserReviewManager()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    review = models.ForeignKey(Review, related_name="user_reviews", on_delete=models.CASCADE)

    def __str__(self) -> str:
        to = self.review.content_object
        message = self.message[:20] if self.message else ""
        return f"from '{self.user}' to '{to}'; Score: {self.score}; Review: '{message}...'"

    def update(self, **kwargs: Any) -> "UserReview":
        for field, value in kwargs.items():
            setattr(self, field, value)

        self.save()
        return self
