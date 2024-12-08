from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import SellerProfile, User


@receiver(post_save, sender=User)
def create_profiles(sender, instance, created, **kwargs):  # noqa: F841
    if created:
        SellerProfile.objects.create(public_username=instance.username, user=instance)
        # TODO: BuyerProfile.objects.create(user=instance)
