from enum import Enum

from django.db import models
from django.utils.translation import gettext_lazy as _


class ProductImageSize(Enum):
    SMALL = (225, 300)
    MEDIUM = (450, 600)
    LARGE = (900, 1200)


class ProductPagePagination(models.IntegerChoices):
    SMALL = 24, _("24 items per page")
    MEDIUM = 48, _("48 items per page")
    LARGE = 96, _("96 items per page")


class ProductOrdering(models.TextChoices):
    CHEAP_TO_EXPENSIVE = "cheap-to-expensive", _("From cheap to expensive")
    EXPENSIVE_TO_CHEAP = "expensive-to-cheap", _("From expensive to cheap")
    NEW_ITEMS = "new-items", _("New items")
    # TODO: SELLER_RATING = "seller-rating", _("By seller rating")
