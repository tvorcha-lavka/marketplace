from deep_translator import DeeplTranslator
from django.conf import settings
from django.db import models, transaction
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from parler.models import TranslatableModel

from .tasks import translate_fields_task


class AutoTranslatableModel(TranslatableModel):
    class Meta:
        abstract = True

    slug = models.SlugField(_("slug"), max_length=50, unique=True, blank=True)

    def __str__(self):
        return getattr(self, self.field_for_slug())

    def save(self, *args, **kwargs):
        is_new_obj = self.pk is None
        self.generate_slug()

        super().save(*args, **kwargs)
        transaction.on_commit(lambda: self.add_translate_task()) if is_new_obj else None

    def field_for_slug(self) -> str:
        """The method to get the field name, needs to be overridden in the child classes."""
        raise NotImplementedError("Subclasses must implement `field_for_slug` method.")

    def generate_slug(self):
        """Generates a slug based on the value of a field if not set."""
        self_value = getattr(self, self.field_for_slug())
        self.slug = slugify(self.translate(self_value) if not self.slug else self.slug)

    def add_translate_task(self):
        """Starts the celery task to translate each field in translatable_fields."""
        translate_fields_task.apply_async(
            args=(self._meta.label, self.pk),  # type: ignore
            queue="high_priority",
            priority=10,
        )

    def get_translated_fields(self) -> list[str]:
        """Return the list of translated fields."""
        return self._parler_meta.get_translated_fields()

    def translate_field(self, field_name: str, field_value: str) -> None:
        """Creates or updates translations for a model field, based on a database value and unsaved value."""
        languages = [code for (code, lang) in settings.LANGUAGES if code != self.language_code]

        for language in languages:
            translated_value = self.translate(field_value, language)
            self.create_translation(language, **{field_name: translated_value})

    def translate(self, value: str, target_language: str = "en") -> str:
        """Translate a value to a target language and return the translated value."""
        translator = DeeplTranslator(source=self.language_code, target=target_language)
        return translator.translate(value)
