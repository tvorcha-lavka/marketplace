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
    required = models.BooleanField(_("required"), default=False)

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
        ft: FilterType = self.filter_type  # type: ignore
        ft_name = ft.safe_translation_getter(field="name", language_code=self.language_code)

        return f"{ft_name} - {super().__str__()}"

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

    def __str__(self):
        filter_value_list = self.list_formatting(field="value", related_field="filter_values")
        return f"{super().__str__()} ({filter_value_list})"

    def field_for_slug(self) -> str:
        return "name"


class FilterGroupSet(AutoTranslatableModel):
    class Meta:
        db_table = "filter_group_set"
        verbose_name = _("filter group set")
        verbose_name_plural = _("filter group sets")

    translations = TranslatedFields(name=models.CharField(_("name"), max_length=50))
    groups = models.ManyToManyField(FilterGroup, verbose_name=_("filter groups"))

    def __str__(self):
        group_list = self.list_formatting(field="name", related_field="groups")
        return f"{super().__str__()} ({group_list})"

    def field_for_slug(self) -> str:
        return "name"
