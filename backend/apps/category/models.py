from django.conf import settings
from django.core.validators import MinLengthValidator
from django.db import models, transaction
from django.utils.translation import gettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey
from parler.models import TranslatedFields

from apps.utils.translation.models import AutoTranslatableModel

from .choices import CardOrientation, TitlePosition
from .managers import CategoryManager
from .utils import category_card_images_upload_to, category_images_upload_to


class Category(MPTTModel, AutoTranslatableModel):
    class Meta:
        db_table = "category"
        verbose_name = _("category")
        verbose_name_plural = _("categories")
        ordering = ["id", "order"]

    class MPTTMeta:
        order_insertion_by = ["level"]

    translations = TranslatedFields(title=models.CharField(_("title"), max_length=50))
    slug = models.SlugField(_("slug"), max_length=50, blank=True)
    url = models.CharField(_("url"), unique=True, blank=True)
    active = models.BooleanField(_("active"), default=True)
    order = models.PositiveSmallIntegerField(_("order"), default=0)

    objects = CategoryManager()
    parent = TreeForeignKey(
        to="self",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="children",
        verbose_name=_("parent"),
    )

    def save(self, *args, **kwargs):
        is_new_obj = self.pk is None

        self.generate_slug()
        self.generate_url()

        super().save(*args, **kwargs)
        transaction.on_commit(self.add_translate_task) if is_new_obj else None

    @property
    def absolute_url(self) -> str:
        return settings.BASE_FRONTEND_URL + self.url

    @property
    def category_image(self):
        if hasattr(self, "image"):
            return self.image

        # Return the default image
        return CategoryImage(image="category/default/category.jpg", alt=_("Default category image"))

    @property
    def category_card(self):
        if hasattr(self, "card"):
            return self.card

        # Return default card
        return Card(bg_color="#D2D2D2")

    @property
    def category_statistics(self):
        if hasattr(self, "statistics"):
            return self.statistics

        # Return default statistics
        return Statistics()

    def field_for_slug(self) -> str:
        return "title"

    def clean(self):
        self.clean_url()

    def clean_url(self):
        self.url = self.url.replace(settings.BASE_FRONTEND_URL, "")

    def generate_url(self) -> None:
        """Sets the url for the category based on slug or parent category slug."""
        new_url = f"{self.parent.url}/{self.slug}" if self.parent else f"/{self.slug}"  # type: ignore
        children = self.get_descendants() if self.pk and self.url != new_url else []

        children_to_update = []
        for child in children:
            setattr(child, "url", getattr(child, "url").replace(self.url, new_url))
            children_to_update.append(child)

        self.url = new_url
        self.__class__.objects.bulk_update(children_to_update, ["url"]) if children_to_update else None

    def get_ancestors(self, ascending=False, include_self=False):
        return (
            super()
            .get_ancestors(ascending, include_self)
            .select_related("image", "card", "card__image", "statistics")
            .prefetch_related("translations")
            .order_by("order")
        )

    def get_children(self):
        return (
            super()
            .get_children()
            .select_related("image", "card", "card__image", "statistics")
            .prefetch_related("translations")
            .order_by("order")
        )


class CategoryImage(models.Model):
    class Meta:
        db_table = "category_image"
        verbose_name = _("category image")
        verbose_name_plural = _("category images")

    image = models.ImageField(_("image"), upload_to=category_images_upload_to)
    alt = models.CharField(_("alt text"), max_length=50, blank=True)

    objects = models.Manager()
    category = models.OneToOneField(
        to=Category,
        on_delete=models.CASCADE,
        related_name="image",
        verbose_name=_("category"),
    )

    def __str__(self):
        return self.category.title if hasattr(self, "category") else self.__class__.__name__  # type: ignore

    @property
    def absolute_url(self) -> str:
        return f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{self.image.name}"


class Card(models.Model):
    class Meta:
        db_table = "category_card"
        verbose_name = _("card design")
        verbose_name_plural = _("card designs")

    orientation = models.CharField(
        _("orientation"),
        default=CardOrientation.HORIZONTAL,
        choices=CardOrientation.choices,
        max_length=10,
    )
    title_position = models.CharField(
        _("title position"),
        default=TitlePosition.TOP_LEFT,
        choices=TitlePosition.choices,
        max_length=15,
    )
    text_wrap = models.BooleanField(_("text wrap"), default=True)
    bg_color = models.CharField(_("background color"), max_length=7, validators=[MinLengthValidator(7)])

    objects = models.Manager()
    category = models.OneToOneField(
        to=Category,
        on_delete=models.CASCADE,
        related_name="card",
        verbose_name=_("category"),
    )

    def __str__(self):
        return self.category.title if hasattr(self, "category") else self.__class__.__name__  # type: ignore

    @property
    def card_image(self):
        if hasattr(self, "image"):
            return self.image

        # Return default card image
        return CardImage(image="category/default/card.png", alt=_("Default card image"))


class CardImage(models.Model):
    class Meta:
        db_table = "category_card_image"
        verbose_name = _("category card image")
        verbose_name_plural = _("category card images")

    image = models.ImageField(_("image"), upload_to=category_card_images_upload_to)
    alt = models.CharField(_("alt text"), max_length=50, blank=True)

    size = models.FloatField(_("size"), default=100, max_length=3)
    x_axis = models.FloatField(_("x-axis"), default=0)
    y_axis = models.FloatField(_("y-axis"), default=0)

    objects = models.Manager()
    card = models.OneToOneField(Card, on_delete=models.CASCADE, related_name="image", verbose_name=_("card"))

    def __str__(self):
        return self.card.category.title if hasattr(self, "card") else self.__class__.__name__  # type: ignore

    @property
    def absolute_url(self) -> str:
        return f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{self.image.name}"


class Statistics(models.Model):
    class Meta:
        db_table = "category_statistic"
        verbose_name = _("category statistic")
        verbose_name_plural = _("category statistics")

    _step = 0.001
    views_count = models.FloatField(_("views count"), default=0.0)
    purchases_count = models.FloatField(_("purchases count"), default=0.0)
    popularity_score = models.FloatField(_("popularity score"), default=0.0)

    objects = models.Manager()
    category = models.OneToOneField(
        to=Category,
        on_delete=models.CASCADE,
        related_name="statistics",
        verbose_name=_("category"),
    )

    def __str__(self):
        return self.category.title if hasattr(self, "category") else self.__class__.__name__  # type: ignore

    def increment_views(self) -> None:
        """Increasing the number of views by a given step."""
        self.views_count = round(self.views_count + self._step, 3)  # type: ignore
        self.update_popularity()

    # TODO: Decide when we will increment purchases stats for a category.
    #  Maybe make a signal in `product.views` or directly in the middleware?
    def increment_purchases(self) -> None:
        """Increasing the number of purchases by a given step."""
        self.purchases_count = round(self.purchases_count + self._step, 3)  # type: ignore
        self.update_popularity()

    def update_popularity(self) -> None:
        """Update popularity_score."""
        views, purchases = self.views_count * 0.5, self.purchases_count * 1.5
        self.popularity_score = round(views + purchases, 3)
        self.save()
