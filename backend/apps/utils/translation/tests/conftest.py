from django.db import models
from parler.models import TranslatedFields

from apps.utils.translation.models import AutoTranslatableModel
from core.conftest import app  # noqa: F401


class DummyModel(AutoTranslatableModel):
    translations = TranslatedFields(name=models.CharField("name", max_length=50))
    values = models.ManyToManyField("self", symmetrical=False)
