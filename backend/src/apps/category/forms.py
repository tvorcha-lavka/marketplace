from typing import Any, cast

from django.conf import settings
from django.contrib.admin import StackedInline
from django.db.models import QuerySet
from django.forms import CharField, HiddenInput, ModelChoiceField, ModelForm, TextInput
from django.utils.translation import gettext_lazy as _
from mptt.forms import MPTTAdminForm  # noqa
from parler.forms import TranslatableModelForm

from .managers import CategoryQuerySet
from .models import Card, CardImage, Category, CategoryImage, Statistics


# --- Category ---------------------------------------------------------------------------------------------------------
class CategoryAdminForm(TranslatableModelForm[Category], MPTTAdminForm[Category]):  # type: ignore[misc]
    class Meta:
        model = Category
        fields = ("title", "parent", "order", "active", "slug", "url")

    url = CharField(
        disabled=True,
        required=False,
        label=_("URL preview"),
        widget=TextInput(attrs={"style": "width: 100%"}),
    )

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)

        self.initial["url"] = settings.BASE_FRONTEND_URL + self.instance.url
        parent_field = self.fields["parent"]

        # fmt: off
        parent_field.queryset = (
            parent_field.queryset
            .order_by("pk")
            .prefetch_related("translations")
        )
        # fmt: on


# --- Category Image ---------------------------------------------------------------------------------------------------
class CategoryImageAdminForm(ModelForm[CategoryImage]):
    class Meta:
        model = CategoryImage
        fields = ("image", "alt")
        widgets = {"alt": TextInput(attrs={"placeholder": "(%s)" % _("Optional")})}


class CategoryImageInline(StackedInline[CategoryImage, Category]):
    form = CategoryImageAdminForm
    model = CategoryImage
    extra = 1
    max_num = 1


# --- Card -------------------------------------------------------------------------------------------------------------
class CategoryCardAdminForm(ModelForm[Card]):
    class Meta:
        model = Card
        fields = ("category", "orientation", "title_position", "bg_color", "text_wrap")
        widgets = {"bg_color": TextInput(attrs={"placeholder": "#hex-code"})}

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        category_field = cast(ModelChoiceField[Category], self.fields["category"])

        if self.instance.pk:
            category_field.widget = HiddenInput()

        # fmt: off
        category_field.queryset = (
            cast(CategoryQuerySet, category_field.queryset)
            .filter(card=None)
            .prefetch_related("translations")
        )
        # fmt: on


# --- Card Image -------------------------------------------------------------------------------------------------------
class CardImageAdminForm(ModelForm[CardImage]):
    class Meta:
        model = CardImage
        fields = ("image", "size", "x_axis", "y_axis", "alt")
        widgets = {"alt": TextInput(attrs={"placeholder": "(%s)" % _("Optional")})}


class CardImageInline(StackedInline[CardImage, Card]):
    form = CardImageAdminForm
    model = CardImage
    extra = 1
    max_num = 1

    def get_queryset(self, *args: Any, **kwargs: Any) -> QuerySet[CardImage]:
        return (
            super()
            .get_queryset(*args, **kwargs)
            .select_related("card__category")
            .prefetch_related("card__category__translations")
        )


# --- Category Statistic -----------------------------------------------------------------------------------------------
class CategoryStatisticInline(StackedInline[Statistics, Category]):
    model = Statistics
