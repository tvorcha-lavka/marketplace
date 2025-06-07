from django.db import models
from django.utils.translation import gettext_lazy as _


class CardOrientation(models.TextChoices):
    VERTICAL = "vertical", _("Vertical")
    HORIZONTAL = "horizontal", _("Horizontal")


class TitlePosition(models.TextChoices):
    TOP_LEFT = "top-left", _("Top left")
    TOP_RIGHT = "top-right", _("Top right")
    TOP_MIDDLE = "top-middle", _("Top middle")
    BOTTOM_LEFT = "bottom-left", _("Bottom left")
    BOTTOM_RIGHT = "bottom-right", _("Bottom right")
    BOTTOM_MIDDLE = "bottom-middle", _("Bottom middle")
