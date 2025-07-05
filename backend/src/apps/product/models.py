from pathlib import Path
from typing import Any

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.category.models import Category
from apps.filter.models import FilterValue
from apps.product.images import ImagePresetEnum, OriginalImage, ProcessedImage, ProcessedImageBundle
from apps.product.validators import validate_description, validate_price, validate_title
from apps.user.models import SellerProfile
from apps.utils.models import UUIDv7Model


class Product(UUIDv7Model):
    class Meta:
        db_table = "product"
        verbose_name = _("Product")
        verbose_name_plural = _("Products")

    title = models.CharField(_("title"), max_length=50, validators=[validate_title])
    description = models.TextField(_("description"), validators=[validate_description])

    price = models.DecimalField(_("price"), max_digits=10, decimal_places=2, validators=[validate_price])
    quantity = models.PositiveIntegerField(_("quantity"), default=1)
    date_published = models.DateTimeField(_("date published"), null=True, blank=True, db_index=True)

    active = models.BooleanField(_("active"), default=False, db_index=True)
    draft = models.BooleanField(_("draft"), default=False, db_index=True)
    is_vip = models.BooleanField(_("vip"), default=False, db_index=True)

    # TODO: verified = models.BooleanField(_("verified"), default=False)
    #  Не обязательный параметр, но в будущем полезно.
    #  Что-то на подобии верификации, что продукт соответствует реальности.
    #  Я думаю это будет реализовано через модераторов или в идеале AI.

    objects = models.Manager()
    owner = models.ForeignKey(
        to=SellerProfile,
        on_delete=models.CASCADE,
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

    def get_card_image_url(self) -> str:
        if image := self.images.first():
            return image.processed_images_bundle.MEDIUM.url

        return settings.DEFAULT_IMAGE

    # def active_setter(self):
    #     self.active = False if self.draft else True
    #
    # def published_date_setter(self):
    #     self.date_published = timezone.now().date() if self.active else None

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

    hash = models.CharField(_("hash"), max_length=16, null=True, blank=True, db_index=True)  # noqa: VNE003
    priority = models.PositiveSmallIntegerField(_("priority"), default=0)

    objects = models.Manager()
    product = models.ForeignKey(
        to=Product,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name=_("product"),
    )

    def __str__(self) -> str:
        return Path(self.original_image.url).name

    @property
    def original_image(self) -> OriginalImage:
        """Pydantic model for the original image."""
        img = ImagePresetEnum.ORIGINAL
        return OriginalImage(
            id=self.id,
            url=img.url_template.format(
                product_id=self.product_id,
                hash=self.hash,
            ),
        )

    @property
    def processed_images_bundle(self) -> ProcessedImageBundle:
        """Bundle of Pydantic models for processed images."""
        pydantic_models_map = {
            img.name: ProcessedImage(
                url=img.url_template.format(
                    product_id=self.product_id,
                    hash=self.hash,
                ),
                height=img.height,
                width=img.width,
            )
            for img in ImagePresetEnum
            if img != ImagePresetEnum.ORIGINAL
        }
        return ProcessedImageBundle(**pydantic_models_map)

    @property
    def processed_images_dump(self) -> list[dict[str, Any]]:
        """List of dicts for processed images."""
        return [img.model_dump() for img in self.processed_images_bundle]
