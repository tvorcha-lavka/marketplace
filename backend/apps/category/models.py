import re
from typing import Tuple

from deep_translator import DeeplTranslator
from django.conf import settings
from django.db import models
from django.db.models import QuerySet
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey
from parler.models import TranslatableModel, TranslatedFields

from .managers import CategoryManager

BASE_LANGUAGE = settings.LANGUAGE_CODE


class Category(MPTTModel, TranslatableModel):
    class Meta:
        db_table = "category"
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")
        ordering = ["level", "order"]

    name = models.SlugField(_("name"), max_length=50, blank=True)
    href = models.CharField(_("href"), unique=True, blank=True)
    order = models.PositiveSmallIntegerField(_("order"))
    active = models.BooleanField(_("active"), default=True)

    objects = CategoryManager()
    translations = TranslatedFields(title=models.CharField(_("title"), max_length=50))
    parent = TreeForeignKey("self", on_delete=models.PROTECT, null=True, blank=True, related_name="children")

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True)

    def save(self, *args, **kwargs):
        db_title, current_title = self.get_db_and_current_title()
        force_insert = kwargs.get("force_insert", False)
        super().save(*args, **kwargs)

        if db_title != current_title:
            self.__title_translate(db_title, current_title)

        if not force_insert and not self.name:
            self.name = self.__set_name()

        self.href = self.__set_href(force_insert)
        super().save(force_update=True, update_fields=["name", "href"])

    @property
    def absolute_url(self) -> str:
        return settings.BASE_FRONTEND_URL + self.href

    @property
    def get_image_title_position(self) -> str:
        return self.image.title_position  # type: ignore

    @property
    def get_popularity_score(self) -> int:
        return self.statistics.popularity_score  # type: ignore

    def get_translated_title(self, lang=BASE_LANGUAGE) -> str:
        return self.safe_translation_getter("title", language_code=lang, any_language=True)

    def get_db_and_current_title(self) -> Tuple[str, str]:
        """Gets the title from the database and the current title for comparison."""
        db_title = self.__class__.objects.language(BASE_LANGUAGE).get(pk=self.pk).title if self.pk else None
        current_title = self.title  # type: ignore
        return db_title, current_title

    def __title_translate(self, db_title: str, current_title: str) -> None:
        languages = [lang[0] for lang in settings.LANGUAGES if lang[0] != BASE_LANGUAGE]

        def create_translation(lang) -> None:
            self.create_translation(lang, title=translate(lang))

        def update_translation(lang) -> None:
            translation = self.get_translation(lang)
            translation.title = translate(lang)
            translation.save()

        def translate(lang) -> str:
            translator = DeeplTranslator(source=BASE_LANGUAGE, target=lang)
            return translator.translate(current_title)

        list(map(create_translation if db_title is None else update_translation, languages))

    def __set_name(self) -> str:
        """Generates a slug-field name for the category based on its title."""
        # Step 1: Remove any text within (parentheses), [square brackets], {curly brackets}, <angle brackets>.
        step_1 = re.sub(r"\s*[(\[{<][^>)\]}]*[>)\]}]", "", self.title)  # type: ignore

        # Step 2: Splits on specific delimiters such as hyphens, pipes, and slashes.
        result = re.split(r" - | — |[,.:|/\\]", step_1)

        # Step 3: Translate and return first segment
        translator = DeeplTranslator(source=BASE_LANGUAGE, target="en")
        return slugify(translator.translate(result[0]))

    def __set_href(self, force_insert=False) -> str:
        """Sets the href for the category based on the name and parent category."""
        new_href = self.parent.href + f"/{self.name}" if self.parent else f"/{self.name}"  # type: ignore

        children = self.get_children() if self.pk else None
        if not force_insert and children and self.href != new_href:
            self.__rebuild_children_field(children, "href", self.href, new_href)

        return new_href

    def __rebuild_children_field(self, children: QuerySet, field: str, old_value: str, new_value: str) -> None:
        """Updates the field value of the category's child elements."""
        children_to_update = []

        for category in children:
            setattr(category, field, getattr(category, field).replace(old_value, new_value))
            children_to_update.append(category)

        self.__class__.objects.bulk_update(children_to_update, [field])


class TitlePosition(models.TextChoices):
    TOP_LEFT = "top left", _("top left")
    TOP_RIGHT = "top right", _("top right")
    TOP_MIDDLE = "top middle", _("top middle")
    BOTTOM_LEFT = "bottom left", _("bottom left")
    BOTTOM_RIGHT = "bottom right", _("bottom right")
    BOTTOM_MIDDLE = "bottom middle", _("bottom middle")


class CategoryImage(models.Model):
    class Meta:
        db_table = "category_image"
        verbose_name = _("Category Image")
        verbose_name_plural = _("Category Images")

    image = models.ImageField(upload_to="category_images/")
    title_position = models.CharField(
        _("title position"), default=TitlePosition.TOP_LEFT, choices=TitlePosition.choices, max_length=15
    )
    objects = models.Manager()
    category = models.OneToOneField(Category, on_delete=models.CASCADE, related_name="image")

    def __str__(self):
        return f"Image {self.pk} - {self.title_position}"


class CategoryStatistics(models.Model):
    class Meta:
        db_table = "category_statistic"
        verbose_name = _("Category Statistic")
        verbose_name_plural = _("Category Statistics")

    views_count = models.FloatField(_("views count"), default=0.0)
    purchases_count = models.FloatField(_("views count"), default=0.0)
    popularity_score = models.FloatField(_("views count"), default=0.0)

    objects = models.Manager()
    category = models.OneToOneField(Category, on_delete=models.CASCADE, related_name="statistics")

    def update_popularity(self) -> None:
        """Update popularity_score."""
        views, purchases = self.views_count * 0.5, self.purchases_count * 1.5
        self.popularity_score = round(views + purchases, 3)
        self.save()

    def increment_views(self, step=0.001) -> None:
        """Increasing the number of views by a given step."""
        self.views_count = round(self.views_count + step, 3)  # type: ignore
        self.update_popularity()

    def increment_purchases(self, step=0.001) -> None:
        """Increasing the number of purchases by a given step."""
        self.purchases_count = round(self.purchases_count + step, 3)  # type: ignore
        self.update_popularity()
