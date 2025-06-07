from typing import cast

from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.db import connection, models, transaction
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from parler.models import TranslatedFields

from apps.category.models import Category
from apps.filter.validators import validate_position
from apps.utils.translation.models import AutoTranslatableModel


class FilterType(AutoTranslatableModel, models.Model):  # type: ignore[django-manager-missing]
    class Meta:
        db_table = "filter_type"
        verbose_name = _("filter type")
        verbose_name_plural = _("filter types")
        ordering = ["list_position"]

    translations = TranslatedFields(
        name=models.CharField(_("name"), max_length=50),
    )
    list_position = models.PositiveSmallIntegerField(_("list position"), default=1, validators=[validate_position])
    required = models.BooleanField(_("required"), default=False)

    def __str__(self) -> str:
        return self.filter_name

    @property
    def filter_name(self) -> str:
        return cast(str, self.safe_translation_getter("name"))

    @property
    def slug(self) -> str:
        return slugify(cast(str, self.safe_translation_getter("name", language_code="en")))


class FilterValue(AutoTranslatableModel, models.Model):
    class Meta:
        db_table = "filter_value"
        verbose_name = _("filter value")
        verbose_name_plural = _("filter values")

    translations = TranslatedFields(
        value=models.CharField(_("value"), max_length=50),
        description=models.TextField(_("description"), blank=True),
    )
    metadata = models.JSONField(_("metadata"), blank=True, default=dict)
    filter_type = models.ForeignKey(
        to=FilterType,
        on_delete=models.CASCADE,
        related_name="filter_values",
        verbose_name=_("filter type"),
    )

    def __str__(self) -> str:
        description = f" ({self.filter_description})" if self.filter_description else ""
        return f"{self.filter_type} - {self.filter_value}{description}"

    @property
    def filter_value(self) -> str:
        return cast(str, self.safe_translation_getter("value"))

    @property
    def filter_description(self) -> str:
        return cast(str, self.safe_translation_getter("description", ""))

    def clean(self) -> None:
        with connection.cursor() as cursor:
            cursor.execute("SELECT txid_current();")
            transaction_id = cursor.fetchone()[0]

        value = self.safe_translation_getter(field="value")
        cache_key = f"filter_value.tnx:{transaction_id}"
        cached_values = cache.get(cache_key, set())

        if value in cached_values:
            raise ValidationError(_("The combination of filter type and value must be unique."))

        cached_values.add(value)
        cache.set(cache_key, cached_values, timeout=300)
        transaction.on_commit(lambda: cache.delete(cache_key))


class FilterGroup(models.Model):
    class Meta:
        db_table = "filter_group"
        verbose_name = _("filter group")
        verbose_name_plural = _("filter groups")
        constraints = [models.UniqueConstraint(fields=("filter_type", "category"), name="unique_filter_type_category")]

    objects = models.Manager()
    category = models.ForeignKey(Category, models.CASCADE, related_name="filter_groups", verbose_name=_("category"))
    filter_type = models.ForeignKey(FilterType, models.CASCADE, related_name="group", verbose_name=_("filter type"))
    filter_values = models.ManyToManyField(FilterValue, related_name="group", verbose_name=_("filter values"))

    def __str__(self) -> str:
        return str(self.filter_type)
