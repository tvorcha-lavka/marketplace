from django.db import models
from django.utils.translation import gettext_lazy as _
from parler.models import TranslatedFields

from apps.utils.translation.models import AutoTranslatableModel


class FilterType(AutoTranslatableModel):
    class Meta:
        db_table = "filter_type"
        verbose_name = _("filter type")
        verbose_name_plural = _("filter types")

    translations = TranslatedFields(name=models.CharField(_("name"), max_length=50))

    def field_for_slug(self) -> str:
        return "name"


class FilterValue(AutoTranslatableModel):
    class Meta:
        db_table = "filter_value"
        verbose_name = _("filter value")
        verbose_name_plural = _("filter values")
        constraints = [models.UniqueConstraint(fields=("slug", "filter_type"), name="unique_slug_filter_type")]

    translations = TranslatedFields(
        value=models.CharField(_("value"), max_length=50),
        description=models.TextField(_("description"), blank=True),
    )
    metadata = models.JSONField(_("metadata"), blank=True, default=dict)
    filter_type = models.ForeignKey(FilterType, models.CASCADE, "values", verbose_name=_("filter type"))

    def __str__(self):
        return f"{str(self.filter_type)} - {getattr(self, self.field_for_slug())}"

    def field_for_slug(self) -> str:
        return "value"


class FilterGroup(AutoTranslatableModel):
    class Meta:
        db_table = "filter_group"
        verbose_name = _("filter group")
        verbose_name_plural = _("filter groups")

    translations = TranslatedFields(name=models.CharField(_("name"), max_length=50))
    filter_type = models.ForeignKey(FilterType, models.CASCADE, verbose_name=_("filter type"))
    filter_values = models.ManyToManyField(FilterValue, verbose_name=_("filter values"))

    def field_for_slug(self) -> str:
        return "name"
