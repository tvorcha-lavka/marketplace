from django.db import models

from .fields import TempImageField


class TempImageModel(models.Model):
    class Meta:
        abstract = True

    image_temp = TempImageField()
