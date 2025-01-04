from django.core.files.uploadedfile import UploadedFile


class TempImageField:
    """
    A descriptor class that mimics a field but doesn't get created in the database.
    It stores the image temporarily in memory.
    """

    def __init__(self):
        self.name = "_temp_image"

    def __get__(self, instance, owner):
        return getattr(instance, self.name, None)

    def __set__(self, instance, value):
        if isinstance(value, UploadedFile):
            setattr(instance, self.name, value)
        else:
            raise ValueError("Value must be an UploadedFile instance.")
