from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.category.models import Category
from apps.filter.models import FilterValue
from apps.product.utils import path_to_large_image, path_to_medium_image, path_to_small_image
from apps.product.validators import validate_description, validate_image_priority, validate_price, validate_title
from apps.user.models import SellerProfile
from apps.utils.image.models import TempImage
from apps.utils.models import UUIDv7Model


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


class ProductImage(UUIDv7Model, TempImage):
    class Meta:
        db_table = "product_image"
        verbose_name = _("Product Image")
        verbose_name_plural = _("Product Images")
        ordering = ["priority"]

    priority = models.PositiveSmallIntegerField(_("priority"), default=1, validators=[validate_image_priority])

    image_large = models.ImageField(_("large image"), null=True, blank=True, upload_to=path_to_large_image)
    image_medium = models.ImageField(_("medium image"), null=True, blank=True, upload_to=path_to_medium_image)
    image_small = models.ImageField(_("small image"), null=True, blank=True, upload_to=path_to_small_image)

    objects = models.Manager()
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images", verbose_name=_("product"))

    def __str__(self):
        return f"{self.product} - {self.priority}.jpg"

    def save(self, *args, **kwargs):
        if self.image_temp:
            self.image_name_setter()
            self.image_upload_setter()
        super().save(*args, **kwargs)

    def image_name_setter(self) -> None:
        """Sets temporary image name for retrieve it in soon."""
        extension = self.image_temp.name.split(".", 1)[-1]
        name = self.image_temp._file_hash[:5]  # noqa
        self.image_temp.name = f"{name}.{extension}"

    def image_upload_setter(self) -> None:
        """Sets upload urls for each image size for immediate data retrieval."""
        for size in ["small", "medium", "large"]:
            upload_to = globals()[f"path_to_{size}_image"]
            setattr(self, f"image_{size}", upload_to(self, self.image_temp.name))
