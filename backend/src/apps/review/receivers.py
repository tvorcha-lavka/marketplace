from typing import Any

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import UserReview


@receiver([post_save, post_delete], sender=UserReview)
def calculate_reviews(sender: UserReview, instance: UserReview, **kwargs: Any) -> None:  # noqa: F841
    instance.review.calculate()
