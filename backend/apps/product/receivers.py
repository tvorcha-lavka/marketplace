from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver

from apps.product.models import ProductImage
from apps.utils.image.utils import user_compress_image

# from apps.utils.image.tasks import user_compress_image_task


@receiver(pre_save, sender=ProductImage)
def compress_product_image(sender, instance, **kwargs):  # noqa: F841
    # TODO: Надо бы организовать селери задачу для `user_compress_image`
    #  Где-то в apps.utils.image.tasks файлике.
    #  -
    #  Воркеры селери это что-то нечто. Подхватывают налету и выполняют раз в 10 быстрее,
    #  из-за того шо у них там автоскейл настроен и все паралельно фигачат,
    #  правда нужно учитывать что задачи могут одни и те же подхватить по этому нужно
    #  через редис блокировать кислород им. Пример как это реализовано есть в переводах.
    # instance.image = user_compress_image_task.apply_async(
    #     app_label=instance._meta.label,  # type: ignore
    #     model_name=instance._meta.model_name,  # noqa: W0212
    #     instance_pk=instance.pk,
    #     field_name=instance.image
    # )
    instance.image = user_compress_image(instance.image)


@receiver(pre_delete, sender=ProductImage)
def delete_category_image(sender, instance, **kwargs):  # noqa: F841
    instance.image.delete(save=False)
