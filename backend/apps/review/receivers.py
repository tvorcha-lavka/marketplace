from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import UserReview


@receiver([post_save, post_delete], sender=UserReview)
def calculate_reviews(sender, instance, **kwargs):  # noqa: F841
    instance.review.calculate()
