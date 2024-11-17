from django import forms
from django.conf import settings
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from mptt.forms import MPTTAdminForm  # noqa
from parler.forms import TranslatableModelForm

from .models import Card, CardImage, Category, CategoryImage, Statistics


# --- Category ---------------------------------------------------------------------------------------------------------
class CategoryAdminForm(TranslatableModelForm, MPTTAdminForm):
    class Meta:
        model = Category
        fields = ("title", "parent", "order", "active", "slug", "url")

    url = forms.CharField(
        disabled=True,
        required=False,
        label=_("URL preview"),
        widget=forms.TextInput(attrs={"style": "width: 100%"}),
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.initial["url"] = settings.BASE_FRONTEND_URL + self.instance.url

        parent_qs = self.fields["parent"].queryset
        self.fields["parent"].queryset = parent_qs.order_by("pk").prefetch_related("translations")


# --- Category Image ---------------------------------------------------------------------------------------------------
class CategoryImageAdminForm(forms.ModelForm):
    class Meta:
        model = CategoryImage
        fields = ("image", "alt")
        widgets = {"alt": forms.TextInput(attrs={"placeholder": "(%s)" % _("Optional")})}


class CategoryImageInline(admin.StackedInline):
    form = CategoryImageAdminForm
    model = CategoryImage
    extra = 1
    max_num = 1


# --- Card -------------------------------------------------------------------------------------------------------------
class CategoryCardAdminForm(forms.ModelForm):
    class Meta:
        model = Card
        fields = ("category", "orientation", "title_position", "bg_color", "text_wrap")
        widgets = {"bg_color": forms.TextInput(attrs={"placeholder": "#hex-code"})}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["category"].queryset = (
            Category.objects.filter(pk=self.instance.category.pk)
            if self.instance.pk
            else Category.objects.filter(card=None)
        ).prefetch_related("translations")


# --- Card Image -------------------------------------------------------------------------------------------------------
class CardImageAdminForm(forms.ModelForm):
    class Meta:
        model = CardImage
        fields = ("image", "size", "x_axis", "y_axis", "alt")
        widgets = {"alt": forms.TextInput(attrs={"placeholder": "(%s)" % _("Optional")})}


class CardImageInline(admin.StackedInline):
    form = CardImageAdminForm
    model = CardImage
    extra = 1
    max_num = 1


# --- Category Statistic -----------------------------------------------------------------------------------------------
class CategoryStatisticInline(admin.StackedInline):
    model = Statistics
