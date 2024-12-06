from decimal import Decimal
from typing import Dict, Optional, cast

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
    avg_rating = models.DecimalField(max_digits=6, decimal_places=3, default=Decimal(0.0))

    objects = ReviewManager()
    content_object = GenericForeignKey()
    content_type = models.ForeignKey(ContentType, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return (
            f"for '{self.content_object}'; "
            f"Ratings count: {self.ratings_count}; "
            f"Reviews count: {self.reviews_count}; "
            f"Average rating: {self.avg_rating:.1f}"
        )

    def calculate(self):
        # access to UserReview through related name `user_reviews`
        user_reviews = cast(models.QuerySet, getattr(self, "user_reviews"))

        # count `user_reviews` records
        aggregates: Dict[str, Optional[int]] = user_reviews.aggregate(
            ratings_count=models.Count("score"),
            reviews_count=models.Count("message"),
            avg_rating=models.Avg("score"),
        )
        self.ratings_count = aggregates.get("ratings_count") or 0
        self.reviews_count = aggregates.get("reviews_count") or 0
        self.avg_rating = aggregates.get("avg_rating") or 0.0
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

    def __str__(self):
        to = cast(Review, self.review).content_object
        return f"from '{self.user}' to '{to}'; Score: {self.score}; Review: '{self.message[:20]}...'"

    def update(self, **kwargs):
        for field, value in kwargs.items():
            setattr(self, field, value)

        self.save()
        return self
