import uuid6
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.category.models import Category
from apps.filter.models import FilterValue
from apps.product.utils import product_image_path
from apps.product.validators import (
    validate_image_priority,
    validate_price,
    validate_product_quantity,
)
from core.settings.base import AUTH_USER_MODEL


# TODO: Подумать как реализовать проверку количества изображений при первом создании,
#  так как при первом создании всегда 0 изображений (изображения сохраняются только после
#  того как объект товара был сохранен и получил уникальный id).
#  -
#  Есть идея поставить счетчик, но тогда нужно подумать еще как не сохранять изображения
#  до того момента как не загрузится последнее.
#  -
#  Возможно решение вот какое: По скольку нужна проверка в основном на api, то мы же можем сразу во views.py
#  и посчитать количество элементов, там же сразу и сделать raise если элементов больше чем нужно.
#  -
#  Думаю нужно будет еще реализовать функцию которая будет авто инкрементировать значения приоритета, но не факт.


class Product(models.Model):
    class Meta:
        db_table = "product"
        verbose_name = _("Product")
        verbose_name_plural = _("Products")

    id = models.UUIDField(primary_key=True, default=uuid6.uuid7, editable=False)  # noqa: VNE003
    slug = models.SlugField(_("slug"), max_length=100, db_index=True)
    name = models.CharField(_("name"), max_length=100, db_index=True)
    description = models.TextField(_("description"), blank=True)
    price = models.DecimalField(_("price"), max_digits=10, decimal_places=2, validators=[validate_price])
    quantity = models.IntegerField(_("quantity"), default=1, validators=[validate_product_quantity])
    date_published = models.DateField(_("date published"), db_index=True, null=True, blank=True)

    active = models.BooleanField(_("active"), default=True)
    is_vip = models.BooleanField(_("vip"), default=False)

    objects = models.Manager()
    seller = models.ForeignKey(
        to=AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        db_index=True,
        related_name="product",
        verbose_name=_("seller"),
    )
    category = models.ForeignKey(
        to=Category,
        on_delete=models.CASCADE,
        related_name="product",
        verbose_name=_("category"),
    )
    filters = models.ManyToManyField(
        to=FilterValue,
        blank=True,
        related_name="product",
        verbose_name=_("filters"),
    )

    def clean(self):
        self.set_published_date()

    def set_published_date(self):
        self.date_published = timezone.now().date() if self.active else None


class ProductImage(models.Model):
    class Meta:
        db_table = "product_image"
        verbose_name = _("Product Image")
        verbose_name_plural = _("Product Images")
        ordering = ("priority",)
        constraints = [models.UniqueConstraint(fields=("product", "priority"), name="unique_product_image_priority")]

    id = models.UUIDField(primary_key=True, default=uuid6.uuid7, editable=False)  # noqa: VNE003
    image = models.ImageField(_("image"), upload_to=product_image_path)
    priority = models.PositiveSmallIntegerField(_("priority"), default=1, validators=[validate_image_priority])

    objects = models.Manager()
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="image", verbose_name=_("product"))

    def __str__(self):
        return f"{self.product} - {self.image.name.split('/')[-1]}"

    def clean(self):
        self.rename_image()

    def rename_image(self):
        extension = self.image.name.split(".", 1)[-1]
        self.image.name = f"{self.priority}.{extension}"

    # TODO: Возникает ошибка при пересохранении продукта в полях для изображения, пишет что типа не заполненные.
    #  P.S. Возможно был временный баг, сейчас уже не наблюдаю, но проверь на всякий
