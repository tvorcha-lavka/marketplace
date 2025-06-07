from django.db import models
from django.utils.translation import gettext_lazy as _


class Plan(models.TextChoices):
    FREE = "free", _("Free")
    LITE = "lite", _("Lite")
    BASIC = "basic", _("Basic")
    PROFESSIONAL = "professional", _("Professional")
    STORE = "store", _("Store")


PLAN_LIMITS = {
    Plan.FREE: {"free_sales": 10, "vip_sales": 0},
    Plan.LITE: {"free_sales": 10, "vip_sales": 5},
    Plan.BASIC: {"free_sales": 20, "vip_sales": 10},
    Plan.PROFESSIONAL: {"free_sales": 30, "vip_sales": 20},
    Plan.STORE: {"free_sales": 0, "vip_sales": 0},  # No limits
}


class DefaultLimits:
    @staticmethod
    def free_sales() -> int:
        return PLAN_LIMITS[Plan.FREE]["free_sales"]

    @staticmethod
    def vip_sales() -> int:
        return PLAN_LIMITS[Plan.FREE]["vip_sales"]
