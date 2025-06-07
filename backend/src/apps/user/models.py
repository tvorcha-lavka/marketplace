from typing import Any, ClassVar, cast

from django.contrib.auth.models import AbstractUser, UserManager
from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
from django.db.models import QuerySet
from django.utils.translation import gettext_lazy as _

from apps.review.models import Review, UserReview
from apps.utils.models import UUIDv7Model

from .choices import DefaultLimits, Plan
from .validators import validate_email, validate_name, validate_phone_number, validate_username


class CustomUserManager(UserManager["User"]):
    def create_superuser(
        self,
        username: str,
        email: str | None = None,
        password: str | None = None,
        **extra_fields: Any,
    ) -> "User":
        extra_fields.setdefault("is_email_verified", True)
        return super().create_superuser(username, email, password, **extra_fields)


class User(UUIDv7Model, AbstractUser):
    class Meta:
        db_table = "user"
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        ordering = ["id"]

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    email = models.EmailField(_("email"), unique=True, validators=[validate_email])
    username = models.CharField(_("username"), max_length=150, validators=[validate_username])

    first_name = models.CharField(_("first name"), max_length=150, blank=True, validators=[validate_name])
    last_name = models.CharField(_("last name"), max_length=150, blank=True, validators=[validate_name])

    phone_number = models.CharField(
        _("phone number"),
        max_length=20,
        unique=True,
        null=True,
        validators=[validate_phone_number],
    )

    language = models.CharField(_("language"), max_length=2, null=True, blank=True)
    is_email_verified = models.BooleanField(_("is email verified"), default=False)

    objects: ClassVar[CustomUserManager] = CustomUserManager()

    def __str__(self) -> str:
        return self.username

    def verify_email(self) -> None:
        self.is_email_verified = True
        self.save(force_update=True, update_fields=["is_email_verified"])

    def set_new_password(self, raw_password: str) -> None:
        super().set_password(raw_password)
        self.save(force_update=True, update_fields=["password"])


class SellerProfile(models.Model):
    class Meta:
        db_table = "user_seller_profile"
        verbose_name = _("Seller")
        verbose_name_plural = _("Sellers")

    public_username = models.CharField(_("public username"), max_length=150, validators=[validate_username])

    plan = models.CharField(_("plan"), choices=Plan.choices, default=Plan.FREE, max_length=15)
    free_sales = models.PositiveSmallIntegerField(_("free sales"), default=DefaultLimits.free_sales)
    vip_sales = models.PositiveSmallIntegerField(_("vip sales"), default=DefaultLimits.vip_sales)

    objects = models.Manager()
    user = models.OneToOneField(
        to=User,
        primary_key=True,
        on_delete=models.CASCADE,
        related_name="seller_profile",
        verbose_name=_("user"),
    )
    reviews = GenericRelation(Review, verbose_name=_("reviews"))
    # orders = models.ManyToManyField(
    #     to="Order",  # TODO: Order model
    #     blank=True,
    #     related_name="buyer_profile",
    #     verbose_name=_("orders"),
    # )
    # receipts = models.ManyToManyField(
    #     to="Receipt",  # TODO: Receipt model
    #     blank=True,
    #     related_name="seller_profile",
    #     verbose_name=_("receipts"),
    # )

    def __str__(self) -> str:
        return self.public_username

    @property
    def average_rating(self) -> float:
        """Get the average rating of the seller."""
        instance: Review | None = cast(QuerySet[Review], self.reviews).first()
        return float(instance.avg_rating if instance else 0.0)

    @property
    def ratings_count(self) -> int:
        """Get the number of seller ratings."""
        instance: Review | None = cast(QuerySet[Review], self.reviews).first()
        return instance.ratings_count if instance else 0

    @property
    def reviews_count(self) -> int:
        """Get the number of seller reviews."""
        instance: Review | None = cast(QuerySet[Review], self.reviews).first()
        return instance.reviews_count if instance else 0

    def get_all_reviews(self) -> QuerySet[UserReview]:
        """Get all seller reviews."""
        return UserReview.objects.get_reviews(self)

    def can_publish_product(self) -> bool:
        """Check the limits of free and vip sales."""
        return self.free_sales > 0 or self.vip_sales > 0

    def publish_free_product(self) -> None:
        """Reduce the limit on free sales when publishing an item."""
        self.free_sales -= 1
        self.save()

    def publish_vip_product(self) -> None:
        """Reduce the limit on vip sales when publishing an item."""
        self.vip_sales -= 1
        self.save()

    def sell_free_product(self) -> None:
        """Increase the limit on free sales when selling an item."""
        self.free_sales += 1
        self.save()

    def buy_vip_sales(self, amount: int) -> None:
        """A method for buying additional VIP sales."""
        self.vip_sales += amount
        self.save()
