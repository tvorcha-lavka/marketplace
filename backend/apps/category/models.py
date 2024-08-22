from django.db import models
from django.utils.translation import gettext_lazy as _


class Category(models.Model):
    class Meta:
        db_table = "category"
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")
        ordering = ["id", "order"]

    name = models.CharField(_("name"), max_length=255)
    description = models.TextField(_("description"), blank=True)
    slug = models.SlugField(_("slug"), max_length=255)
    url = models.URLField(_("url"), blank=True)
    order = models.PositiveSmallIntegerField(_("order"))
    active = models.BooleanField(_("active"), default=True)

    objects = models.Manager()
    parents = models.ManyToManyField("self", blank=True, related_name="parent_set", symmetrical=False)
    subcategories = models.ManyToManyField("self", blank=True, related_name="subcategory_set", symmetrical=False)

    def __str__(self):
        return f"[{self.pk}] {self.name}"
