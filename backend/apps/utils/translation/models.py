import time

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
        return self.safe_translation_getter(self.field_for_slug(), "-", self.language_code)

    def save(self, *args, **kwargs):
        is_new_obj = self.pk is None
        self.generate_slug()

        super().save(*args, **kwargs)
        transaction.on_commit(self.add_translate_task) if is_new_obj else None

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
            args=(self._meta.label, self.pk, self.language_code),  # type: ignore
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
        max_retries = 5

        for attempt in range(max_retries):
            try:
                return translator.translate(value)
            except ConnectionError:
                time.sleep(1)

        raise ConnectionError(
            "Unsuccessful translation for class (%s). Instance id: (%s). Language code: (%s). "
            "Failed to connect to the translation service after several attempts."
            % (self.__class__.__name__, self.pk, target_language)
        )

    def list_formatting(self, *, field: str, related_field: str, sep: str = ", ") -> str:
        """
        Formats a list of related object fields into a single string.

        This method retrieves the values of a specified field from all related
        objects and joins them into a single string, separated by a specified
        separator.

        If a related object doesn't have a translation for the
        specified field, a default value of "-" is used.

        Parameters:
            field (str): The name of the field from the related objects to be retrieved.
            related_field (str): The name of the related field containing the related objects.
            sep (str): The string used to separate the values in the resulting string.

        Returns:
            str: A single string of concatenated values from the specified field of
            related objects, separated by the specified separator.
        """
        obj_list = [
            obj.safe_translation_getter(field, default="-", language_code=self.language_code)
            for obj in getattr(self, related_field).all()
        ]
        return sep.join(obj_list)
