from dataclasses import dataclass
from pathlib import Path

from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.category.models import Category
from apps.filter.models import FilterValue
from apps.product.validators import validate_description, validate_image_priority, validate_price, validate_title
from apps.user.models import SellerProfile
from apps.utils.image import DEFAULT_IMAGE
from apps.utils.models import UUIDv7Model


@dataclass
class ProcessedImagesBundle:
    size_s: "ProductProcessedImage"  # 150x200
    size_m: "ProductProcessedImage"  # 450x600
    size_l: "ProductProcessedImage"  # 675x900


class Product(UUIDv7Model):
    class Meta:
        db_table = "product"
        verbose_name = _("Product")
        verbose_name_plural = _("Products")

    title = models.CharField(_("title"), db_index=True, max_length=50, validators=[validate_title])
    description = models.TextField(_("description"), validators=[validate_description])

    price = models.DecimalField(_("price"), max_digits=10, decimal_places=2, validators=[validate_price])
    quantity = models.PositiveIntegerField(_("quantity"), default=1)
    date_published = models.DateField(_("date published"), db_index=True, null=True, blank=True)

    active = models.BooleanField(_("active"), default=True)
    draft = models.BooleanField(_("draft"), default=False)
    is_vip = models.BooleanField(_("vip"), default=False)

    # TODO: verified = models.BooleanField(_("verified"), default=False)
    #  Не обязательный параметр, но в будущем полезно.
    #  Что-то на подобии верификации, что продукт соответствует реальности.
    #  Я думаю это будет реализовано через модераторов или в идеале AI.

    objects = models.Manager()
    owner = models.ForeignKey(
        to=SellerProfile,
        on_delete=models.CASCADE,
        db_index=True,
        related_name="products",
        verbose_name=_("owner"),
    )
    category = models.ForeignKey(
        to=Category,
        on_delete=models.CASCADE,
        related_name="products",
        verbose_name=_("category"),
    )
    filters = models.ManyToManyField(
        to=FilterValue,
        blank=True,
        related_name="products",
        verbose_name=_("filters"),
    )

    def save(self, *args, **kwargs):
        self.active_setter()
        self.published_date_setter()
        super().save(*args, **kwargs)

    def active_setter(self):
        self.active = False if self.draft else True

    def published_date_setter(self):
        self.date_published = timezone.now().date() if self.active else None

    def get_card_image_url(self) -> str:
        if self.original_image.exists():
            original = self.original_image.first()
            bundle = ProcessedImagesBundle(*original.processed_images.all())
            return bundle.size_m.image.url

        return DEFAULT_IMAGE

    # def publish(self):
    #     """Publish the item and reduce the seller's limit."""
    #     self.active_setter()
    #     self.published_date_setter()
    #
    #     if self.active and not self.is_vip:
    #         cast(SellerProfile, self.owner).publish_free_product()
    #
    #     elif self.active and self.is_vip:
    #         cast(SellerProfile, self.owner).publish_vip_product()

    # def sell(self):
    #     """Deletes the product if the quantity is 1 and increases the seller's sales limit."""
    #     if self.active and self.quantity == 1:
    #         cast(SellerProfile, self.owner).sell_free_product()
    #         self.delete()


class ProductImage(UUIDv7Model):
    class Meta:
        db_table = "product_image"
        verbose_name = _("Product Image")
        verbose_name_plural = _("Product Images")
        ordering = ["priority"]

        constraints = [models.CheckConstraint(condition=models.Q(priority__lte=9), name="priority_max_9")]

    hash = models.CharField(_("hash"), max_length=16, null=True, blank=True)  # noqa: VNE003
    image = models.ImageField(_("image"), null=True, blank=True)
    priority = models.PositiveSmallIntegerField(_("priority"), default=0, validators=[validate_image_priority])

    objects = models.Manager()
    product = models.ForeignKey(
        to=Product,
        on_delete=models.CASCADE,
        related_name="original_image",
        verbose_name=_("product"),
    )

    def __str__(self) -> str:
        return Path(self.image.url).name


class ProductProcessedImage(UUIDv7Model):
    class Meta:
        db_table = "product_image_processed"
        verbose_name = _("Product Processed Image")
        verbose_name_plural = _("Product Processed Images")

    image = models.ImageField(_("image"), null=True, blank=True)
    height = models.PositiveSmallIntegerField(_("height"))
    width = models.PositiveSmallIntegerField(_("width"))

    objects = models.Manager()
    original_image = models.ForeignKey(
        to=ProductImage,
        on_delete=models.CASCADE,
        related_name="processed_images",
        verbose_name=_("original_image"),
    )

    def __str__(self) -> str:
        return Path(self.image.url).name
